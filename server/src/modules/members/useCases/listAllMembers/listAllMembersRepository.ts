import { User } from '@/modules/users/domain/user';
import { Result } from '@/shared/core/result';
import { Member } from '../../domain/member';

export interface ListAllMembersRepository {
  queryMembers(user: User): Promise<Result<Member[]>>;
}
