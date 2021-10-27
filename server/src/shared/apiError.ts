import { AppError, ErrorCode, ErrorCodes } from './appError';
import { NextFunction, Request, Response } from 'express';

const StatusCodeMap = {
  [ErrorCodes.BAD_REQUEST]: 400,
  [ErrorCodes.USER_NOT_FOUND]: 400,
  [ErrorCodes.MEMBER_NOT_FOUND]: 400,
};

type StatusCodeMapKey = keyof typeof StatusCodeMap;
export class ApiError extends Error {
  statusCode: number;
  code: ErrorCode;
  constructor(message: string, code: ErrorCode, statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);

    this.code = code;
    this.statusCode = statusCode;
  }

  static fromAppError(err: AppError) {
    const { message, code } = err;
    const errorCode = err.code as StatusCodeMapKey;
    let statusCode = StatusCodeMap[errorCode];
    if (!statusCode) {
      statusCode = 500;
    }
    return new ApiError(message, code, statusCode);
  }
}

export function apiErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    const { statusCode, code, message } = ApiError.fromAppError(err);
    return res.status(statusCode).json({ code: code, message: message });
  }
  res.status(500).json({ message: 'something went wrong' });
}
