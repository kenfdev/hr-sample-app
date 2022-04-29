import { User } from '@/modules/users/dtos/userDTO';
import { Result } from '@/shared/core/result';
import { Member } from '../../dtos/memberDTO';

export interface ShowMemberDetailRepository {
  queryMember(user: User, memberId: string): Promise<Result<Member>>;
}
