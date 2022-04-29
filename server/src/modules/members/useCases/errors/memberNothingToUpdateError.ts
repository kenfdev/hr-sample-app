import { AppError, ErrorCodes } from '@/shared/core/errors/appError';

export class MemberNothingToUpdateError extends AppError {
  constructor(memberId: string) {
    super(`nothing is able to be updated: ${memberId}`, ErrorCodes.BAD_REQUEST);
  }
}
