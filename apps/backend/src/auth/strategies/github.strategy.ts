import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL') || '',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: unknown, user?: unknown) => void,
  ): Promise<void> {
    const { id, displayName, username, emails, photos } = profile;
    const primaryEmail = emails?.[0]?.value;
    const resolvedDisplayName =
      displayName ?? username ?? primaryEmail?.split('@')[0] ?? 'GitHub User';
    const avatarUrl = photos?.[0]?.value;

    if (!primaryEmail) {
      return done(new UnauthorizedException('Email not available from GitHub'));
    }

    const user = await this.authService.validateOAuthUser({
      email: primaryEmail, // GitHub might not return email if private
      displayName: resolvedDisplayName,
      githubId: id,
      avatarUrl,
    });
    done(null, user);
  }
}
