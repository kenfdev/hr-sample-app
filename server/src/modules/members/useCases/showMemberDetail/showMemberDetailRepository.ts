import { User } from '@/modules/users/domain/user';
import { Member } from '../../domain/member';

export interface ShowMemberDetailRepository {
  queryMember(user: User, memberId: string): Promise<Member>;
}
