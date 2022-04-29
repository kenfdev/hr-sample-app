export abstract class AppError extends Error {
  code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.code = code;
  }
}

export const ErrorCodes = {
  BAD_REQUEST: 'bad_request',
  INVALID_OPERATION: 'invalid_operation',
  INVALID_ARGUMENT: 'invalid_argument',
  USER_NOT_FOUND: 'user_not_found',
  MEMBER_NOT_FOUND: 'member_not_found',
} as const;

type ErrorKey = keyof typeof ErrorCodes;
export type ErrorCode = typeof ErrorCodes[ErrorKey];
