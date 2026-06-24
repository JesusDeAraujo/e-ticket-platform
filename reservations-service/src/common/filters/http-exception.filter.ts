import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger('HttpException');

catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = host.getType() === 'http';
    
    const status =
        exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
        exception instanceof HttpException ? exception.getResponse() : null;

    const message =
        exception instanceof HttpException
            ? (typeof exceptionResponse === 'object' && exceptionResponse !== null
                ? (exceptionResponse as any).message || exception.message
                : exception.message)
            : 'Internal server error';

const originalPath = request.headers['x-original-url'] || request.url;

const errorResponse = {
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: originalPath === '/' ? '/reservations' : originalPath,
    method: request.method,
    message: Array.isArray(message) ? message : [message],
};

    if (isHttp) {
        this.logger.error(
            `${request.method} ${request.url} - Status: ${status} - Error: ${JSON.stringify(message)}`
        );
    } else {
        this.logger.error(
        `[Redis Event] - Status: ${status} - Error: ${JSON.stringify(message)}`
        );
    }

    if (isHttp && response) {
        response.status(status).json(errorResponse);
        }
    }
}