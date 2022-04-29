import { User } from '@/modules/users/domain/user';
import { Member } from '../../domain/member';

export interface ListAllMembersRepository {
  queryMembers(user: User): Promise<Member[]>;
}
