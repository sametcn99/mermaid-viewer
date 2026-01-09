import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class OAuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();

    type ExceptionPayload = { message?: string | string[] };
    let message: string | string[] = 'Authentication failed';
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const payload = exceptionResponse as ExceptionPayload;
      if (payload.message !== undefined) {
        message = payload.message;
      }
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const frontendUrl = new ConfigService().get<string>('FRONTEND_URL');

    // Check if message is array (class-validator)
    if (Array.isArray(message)) {
      message = message[0];
    }

    response.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent(message)}`,
    );
  }
}
