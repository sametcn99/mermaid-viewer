import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';
import { Request } from 'express';

const REFRESH_TOKEN_COOKIE = 'mv_refresh_token';

function extractRefreshTokenFromCookie(request: Request): string | null {
  const rawCookieHeader = request.headers.cookie;
  if (!rawCookieHeader) {
    return null;
  }

  for (const pair of rawCookieHeader.split(';')) {
    const [key, ...rest] = pair.trim().split('=');
    if (key === REFRESH_TOKEN_COOKIE) {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not defined in environment variables',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractRefreshTokenFromCookie,
        ExtractJwt.fromBodyField('refreshToken'),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email };
  }
}
