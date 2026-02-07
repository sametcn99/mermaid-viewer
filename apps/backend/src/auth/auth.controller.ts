import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RefreshTokenDto,
  TokenResponseDto,
  UserResponseDto,
  UpdateProfileDto,
} from './dto';
import { Public } from './decorators/public.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from './decorators/current-user.decorator';
import { OAuthExceptionFilter } from './filters/oauth-exception.filter';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @CurrentUser('id') userId: string,
  ): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    type: UserResponseDto,
  })
  async me(@CurrentUser() user: CurrentUserData): Promise<UserResponseDto> {
    const fullUser = await this.authService.findById(user.id);
    if (!fullUser) {
      throw new NotFoundException('User not found');
    }
    return {
      id: fullUser.id,
      email: fullUser.email,
      createdAt: fullUser.createdAt,
      updatedAt: fullUser.updatedAt,
      displayName: fullUser.displayName,
      googleId: fullUser.googleId,
      githubId: fullUser.githubId,
    };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  async googleAuth(): Promise<void> {
    // Trigger Google OAuth flow handled by Passport
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@CurrentUser() user: User, @Res() res: Response) {
    const tokens = await this.authService.generateTokens(user);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub' })
  async githubAuth() {
    // Initiates the GitHub OAuth flow
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubAuthRedirect(@CurrentUser() user: User, @Res() res: Response) {
    const tokens = await this.authService.generateTokens(user);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }

  @Post('account')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT) // For backward compatibility if frontend uses POST
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  async deleteAccountPost(@CurrentUser('id') userId: string): Promise<void> {
    await this.authService.deleteAccount(userId);
  }

  @Delete('account')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  async deleteAccount(@CurrentUser('id') userId: string): Promise<void> {
    await this.authService.deleteAccount(userId);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.authService.updateProfile(userId, dto);
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      displayName: user.displayName,
      googleId: user.googleId,
      githubId: user.githubId,
    };
  }
}
