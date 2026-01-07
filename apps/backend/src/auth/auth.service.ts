import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import {
  RegisterDto,
  LoginDto,
  TokenResponseDto,
  AuthResponseDto,
  UpdateProfileDto,
} from './dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.hashPassword(registerDto.password);
    const normalizedEmail = registerDto.email.toLowerCase();
    const trimmedDisplayName = registerDto.displayName?.trim();

    const user = this.userRepository.create({
      email: normalizedEmail,
      passwordHash,
      displayName:
        trimmedDisplayName && trimmedDisplayName.length > 0
          ? trimmedDisplayName
          : normalizedEmail.split('@')[0],
    });

    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        displayName: user.displayName,
        googleId: user.googleId,
        githubId: user.githubId,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        displayName: user.displayName,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
  async validateOAuthUser(details: {
    email: string;
    displayName: string;
    googleId?: string;
    githubId?: string;
    avatarUrl?: string;
  }): Promise<User> {
    const { email, displayName, googleId, githubId, avatarUrl } = details;
    const normalizedEmail = email.toLowerCase();
    const trimmedDisplayName = displayName?.trim();

    const searchConditions: FindOptionsWhere<User>[] = [
      { email: normalizedEmail },
    ];

    if (googleId) {
      searchConditions.push({ googleId });
    }
    if (githubId) {
      searchConditions.push({ githubId });
    }

    const user = await this.userRepository.findOne({
      where: searchConditions,
    });

    if (user) {
      let shouldPersist = false;

      if (googleId && user.googleId && user.googleId !== googleId) {
        throw new ConflictException(
          'Account already linked to another Google profile',
        );
      }
      if (githubId && user.githubId && user.githubId !== githubId) {
        throw new ConflictException(
          'Account already linked to another GitHub profile',
        );
      }

      if (googleId && !user.googleId) {
        user.googleId = googleId;
        shouldPersist = true;
      }

      if (githubId && !user.githubId) {
        user.githubId = githubId;
        shouldPersist = true;
      }

      if (trimmedDisplayName && trimmedDisplayName !== user.displayName) {
        user.displayName = trimmedDisplayName;
        shouldPersist = true;
      }

      if (avatarUrl && avatarUrl !== user.avatarUrl) {
        user.avatarUrl = avatarUrl;
        shouldPersist = true;
      }

      if (shouldPersist) {
        return this.userRepository.save(user);
      }

      return user;
    }

    const resolvedDisplayName =
      trimmedDisplayName && trimmedDisplayName.length > 0
        ? trimmedDisplayName
        : normalizedEmail.split('@')[0];

    const newUser = this.userRepository.create({
      email: normalizedEmail,
      displayName: resolvedDisplayName,
      googleId,
      githubId,
      avatarUrl,
    });

    return this.userRepository.save(newUser);
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.displayName !== undefined) {
      user.displayName = dto.displayName;
    }

    if (dto.newPassword) {
      if (!user.passwordHash) {
        throw new ConflictException(
          'Cannot update password for social login account',
        );
      }
      if (!dto.currentPassword) {
        throw new UnauthorizedException('Current password is required');
      }
      const isPasswordValid = await bcrypt.compare(
        dto.currentPassword,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid current password');
      }
      user.passwordHash = await this.hashPassword(dto.newPassword);
    }

    return this.userRepository.save(user);
  }
}
