import { User } from '@/modules/users/dtos/userDTO';
import { Result } from '@/shared/core/result';
import { Member } from '../../dtos/memberDTO';

export interface ListAllMembersRepository {
  queryMembers(user: User): Promise<Result<Member[]>>;
}
