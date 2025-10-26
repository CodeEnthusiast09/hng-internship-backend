import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ErrorDetails,
  ErrorResponse,
  ValidationErrorResponse,
} from 'src/interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: ErrorResponse | ValidationErrorResponse = {
      error: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse;
      } else {
        message = { error: exceptionResponse };
      }

      // Handle validation errors
      if (status === HttpStatus.BAD_REQUEST) {
        const validationResponse = message as ValidationErrorResponse;
        const validationErrors = validationResponse.message;

        if (Array.isArray(validationErrors)) {
          const details: ErrorDetails = {};
          validationErrors.forEach((error: string) => {
            const field = error.split(' ')[0];
            details[field] = error;
          });

          message = {
            error: 'Validation failed',
            details,
          };
        }
      }
    }

    response.status(status).json(message);
  }
}
