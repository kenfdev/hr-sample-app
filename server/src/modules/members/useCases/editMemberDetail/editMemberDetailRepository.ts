import { User } from '@/modules/users/domain/user';
import { Member } from '../../domain/member';

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
  queryMember(user: User, memberId: string): Promise<Member>;
  updateMember(
    user: User,
    memberId: string,
    payload: UpdatePayload
  ): Promise<void>;
}
