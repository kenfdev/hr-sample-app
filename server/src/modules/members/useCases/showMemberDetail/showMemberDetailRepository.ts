import { User } from '@/modules/users/domain/user';
import { Result } from '@/shared/core/result';
import { Member } from '../../domain/member';

export interface ShowMemberDetailRepository {
  queryMember(user: User, memberId: string): Promise<Result<Member>>;
}
