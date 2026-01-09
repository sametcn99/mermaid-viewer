import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GITHUB_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      const logger = new Logger(GithubStrategy.name);
      if (!clientID) logger.error('GITHUB_CLIENT_ID is not defined');
      if (!clientSecret) logger.error('GITHUB_CLIENT_SECRET is not defined');
      if (!callbackURL) logger.error('GITHUB_CALLBACK_URL is not defined');
    }

    super({
      clientID: clientID || 'NOT_DEFINED',
      clientSecret: clientSecret || 'NOT_DEFINED',
      callbackURL: callbackURL || 'NOT_DEFINED',
      scope: ['user:email'],
      userAgent: 'MermaidViewer', // Explicit User-Agent header required by GitHub API
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
