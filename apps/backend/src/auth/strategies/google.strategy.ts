import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, displayName, emails, photos } = profile;
    const primaryEmail = emails?.[0]?.value;
    const resolvedDisplayName =
      displayName ?? primaryEmail?.split('@')[0] ?? 'Google User';
    const avatarUrl = photos?.[0]?.value;

    if (!primaryEmail) {
      return done(new UnauthorizedException('Email not available from Google'));
    }

    const user = await this.authService.validateOAuthUser({
      email: primaryEmail,
      displayName: resolvedDisplayName,
      googleId: id,
      avatarUrl,
    });
    done(null, user);
  }
}
