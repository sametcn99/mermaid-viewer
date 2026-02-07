import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

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
      this.logger.error(`No email found for Google User: ${profile.id}`);
      return done(new UnauthorizedException('Email not available from Google'));
    }

    try {
      const user = await this.authService.validateOAuthUser({
        email: primaryEmail,
        displayName: resolvedDisplayName,
        googleId: id,
        avatarUrl,
      });
      done(null, user);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error validating Google User: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Unknown error validating Google User: ${JSON.stringify(error)}`,
        );
      }
      done(error, false);
    }
  }
}
