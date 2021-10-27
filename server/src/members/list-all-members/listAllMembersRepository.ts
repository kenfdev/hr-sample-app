import { User } from '@/users/shared/user';
import { Member } from '../shared/member';

export interface ListAllMembersRepository {
  queryMembers(user: User): Promise<Member[]>;
}
