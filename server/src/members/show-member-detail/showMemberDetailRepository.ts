import { User } from '@/users/shared/user';
import { Member } from '../shared/member';

export interface ShowMemberDetailRepository {
  queryMember(user: User, memberId: string): Promise<Member>;
}
