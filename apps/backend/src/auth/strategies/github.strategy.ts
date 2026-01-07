import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
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
        profile: any,
        done: Function,
    ): Promise<any> {
        const { id, displayName, username, emails, photos } = profile;
        const user = await this.authService.validateOAuthUser({
            email: emails?.[0]?.value, // GitHub might not return email if private
            displayName: displayName || username,
            githubId: id,
            avatarUrl: photos?.[0]?.value,
        });
        done(null, user);
    }
}
