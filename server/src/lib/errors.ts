import { Response } from 'express';

export enum ErrorStatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  Uniq = 432,
  Internal = 500,
}

class AppError {
  message: string;
  statusCode: number;

  constructor(statusCode: number, message: string) {
    this.message = message;
    this.statusCode = statusCode;
  }

  getExpressError(res: Response) {
    return res.status(this.statusCode).json({ statusCode: this.statusCode, message: this.message });
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(ErrorStatusCode.BadRequest, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(ErrorStatusCode.Unauthorized, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorStatusCode.Conflict, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(ErrorStatusCode.Forbidden, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(ErrorStatusCode.NotFound, message);
  }
}

export class UniqError extends AppError {
  constructor(message: string) {
    super(ErrorStatusCode.Uniq, message);
  }
}

export class InternalError extends AppError {
  constructor(message: string) {
    super(ErrorStatusCode.Internal, message);
  }
}
