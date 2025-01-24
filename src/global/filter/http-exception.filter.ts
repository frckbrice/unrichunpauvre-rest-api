import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { BaseExceptionFilter } from '@nestjs/core';

type ResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
};

/**
 * Catches and handles exceptions that occur during the execution of the application.
 * It extracts the HTTP context, determines the status code, and returns a JSON response
 * with the error details.
 *
 * @param {Error} exception - The exception that was thrown.
 * @param {ArgumentsHost} host - The host that provides access to the HTTP context.
 * @return {void}
 */
@Catch()
export class AllExceptionsFilter
  extends BaseExceptionFilter
  implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObj: ResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      message: '',
    };

    if (exception instanceof HttpException) {
      responseObj.message = exception.getResponse();
      responseObj.statusCode = exception.getStatus();
    } else if (exception instanceof PrismaClientValidationError) {
      // replace all new line by a space  
      responseObj.message = exception.message.replaceAll(/\n/g, '');
      responseObj.statusCode = 422; // unprocessable content
    } else {
      responseObj.message = 'Internal Server Error';
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // send bac the response
    response
      .status(responseObj.statusCode)
      .json(responseObj);

    //log to console
    this.logger.error(responseObj.message, AllExceptionsFilter.name);

    // call the parent class to handle the error
    super.catch(exception, host);
  }
}
