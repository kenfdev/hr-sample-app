import { AppError, ErrorCodes } from '@/shared/core/errors/appError';

export class UserNotFoundError extends AppError {
  constructor(userId: string) {
    super(`user not found: ${userId}`, ErrorCodes.USER_NOT_FOUND);
  }
}
