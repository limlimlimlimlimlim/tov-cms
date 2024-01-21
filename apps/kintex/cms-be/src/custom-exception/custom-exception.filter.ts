import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `Error: ${status} - ${exception.message}`,
      exception.stack,
    );

    response.status(status).json({
      error: {
        message: 'Internal Server Error',
      },
    });
  }
}
