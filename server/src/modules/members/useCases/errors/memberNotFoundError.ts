import { AppError, ErrorCodes } from '@/shared/core/errors/appError';

export class MemberNotFoundError extends AppError {
  constructor(memberId: string) {
    super(`member not found: ${memberId}`, ErrorCodes.MEMBER_NOT_FOUND);
  }
}
