import { AppError, ErrorCodes } from './appError';

export class InvalidOperationError extends AppError {
  constructor(message = 'invalid operation') {
    super(message, ErrorCodes.INVALID_OPERATION);
  }
}
