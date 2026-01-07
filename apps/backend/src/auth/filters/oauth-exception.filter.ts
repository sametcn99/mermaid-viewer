import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class OAuthExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const exceptionResponse = exception.getResponse();

        let message = 'Authentication failed';
        if (
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
        ) {
            message = (exceptionResponse as any).message;
        } else if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Check if message is array (class-validator)
        if (Array.isArray(message)) {
            message = message[0];
        }

        response.redirect(
            `${frontendUrl}/auth/callback?error=${encodeURIComponent(message)}`,
        );
    }
}
