import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class OAuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(OAuthExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error('OAuth Exception caught', exception);
    if (exception.oauthError) {
      this.logger.error('OAuth Provider Error Data:', exception.oauthError);
    }

    let message = 'Authentication failed';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      type ExceptionPayload = { message?: string | string[] };
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const payload = exceptionResponse as ExceptionPayload;
        if (payload.message !== undefined) {
          const msg = payload.message;
          message = Array.isArray(msg) ? msg[0] : msg;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
       message = exception.message;
    }

    const frontendUrl = new ConfigService().get<string>('FRONTEND_URL');

    response.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent(message)}`,
    );
  }
}
