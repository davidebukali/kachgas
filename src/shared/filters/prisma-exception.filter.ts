import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errorResponse: HttpException;

    switch (exception.code) {
      case 'P2000':
        errorResponse = new BadRequestException(
          `The value for ${String(exception.meta?.target)} is too long.`,
        );
        break;

      case 'P2002':
        errorResponse = new ConflictException(
          `Unique constraint failed on the field: ${String(exception.meta?.target)}`,
        );
        break;

      case 'P2003':
        errorResponse = new BadRequestException(
          `Foreign key constraint failed on the field: ${String(exception.meta?.field_name)}`,
        );
        break;

      case 'P2025':
        errorResponse = new NotFoundException(`Record not found.`);
        break;

      default:
        errorResponse = new InternalServerErrorException(
          `Database error: ${exception.message}`,
        );
        break;
    }

    response
      .status(Number(errorResponse.getStatus()))
      .json(errorResponse.getResponse());
  }
}
