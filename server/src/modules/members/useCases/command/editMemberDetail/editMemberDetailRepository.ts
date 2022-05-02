import { Result } from '@/shared/core/result';
import { MemberDTO } from '../../../dtos/memberDTO';

export type UpdatePayload = {
  firstName?: string;
  lastName?: string;
  age?: number;
  salary?: number;
  departmentId?: string;
  phoneNumber?: string;
  email?: string;
  pr?: string;
};

export interface EditMemberDetailRepository {
  queryMember(memberId: string): Promise<Result<MemberDTO>>;
  updateMember(memberId: string, payload: UpdatePayload): Promise<Result<void>>;
}
