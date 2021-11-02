import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { DataFilter } from '@/auth/shared/dataFilter';
import { Member } from '@/members/shared/member';
import { MemberOrm } from '@/members/shared/typeorm/memberOrm';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { Connection, Repository } from 'typeorm';
import { ListAllMembersRepository } from '../listAllMembersRepository';

export class ListAllMembersSqliteRepository
  implements ListAllMembersRepository
{
  private readonly membersRepository: Repository<MemberOrm>;
  constructor(private readonly dataFilter: DataFilter, conn: Connection) {
    this.membersRepository = conn.getRepository(MemberOrm);
  }

  async queryMembers(user: User): Promise<Member[]> {
    const userOrm = UserOrm.fromUser(user);

    const query = await this.dataFilter.authorizedQuery<MemberOrm>(
      userOrm,
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

    const records = await this.membersRepository.find({
      where: query,
      relations: ['department'],
    });

    return records.map((r) => r.toMember());
  }
}
