
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    let message = 'An unexpected error occurred';
    let errors = undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as any;
      
      // If the exception was thrown by our validation pipe, it might have 'errors' already
      if (resp.errors) {
        errors = resp.errors;
        message = resp.message || 'Validation failed';
      } else {
        message = resp.message || message;
        // NestJS default validation pipe puts array of strings in 'message' if not customized
        if (Array.isArray(resp.message)) {
            message = 'Validation failed';
            // We might want to parse this if we didn't customize the pipe
        }
      }
    } else if (exception instanceof Error) {
        message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
