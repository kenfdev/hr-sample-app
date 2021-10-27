import { User } from '@/users/shared/user';
import { Member } from '../shared/member';

export type UpdatePayload = {
  firstName?: string;
  lastName?: string;
  age?: number;
  salary?: number;
  departmentId?: string;
};

export interface EditMemberDetailRepository {
  queryMember(memberId: string): Promise<Member>;
  updateMember(
    user: User,
    memberId: string,
    payload: UpdatePayload
  ): Promise<void>;
}
