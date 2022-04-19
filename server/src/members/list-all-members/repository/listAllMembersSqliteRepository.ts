import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { MemberOrm, UserOrm } from '@/auth/shared/createOso';
import { DataFilter } from '@/auth/shared/dataFilter';
import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { User } from '@/users/shared/user';
import { PrismaClient } from '@prisma/client';
import { ListAllMembersRepository } from '../listAllMembersRepository';

export class ListAllMembersSqliteRepository
  implements ListAllMembersRepository
{
  private readonly prisma: PrismaClient;
  constructor(private readonly dataFilter: DataFilter, prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async queryMembers(user: User): Promise<Member[]> {
    const userModel = UserOrm.fromEntity(user);
    console.log('queryMembers', userModel);
    const query = await this.dataFilter.authorizedQuery(
      userModel,
      MEMBER_ACTIONS.READ,
      MemberOrm
    );
    console.log('queryMembers finished', JSON.stringify(query, undefined, 2));

    const records = await this.prisma.member.findMany({
      where: query,
      include: {
        department: true,
      },
    });

    return records.map((member) => {
      return new Member(
        member.id,
        member.avatar,
        member.firstName,
        member.lastName,
        member.age,
        member.salary,
        new Department(
          member.department.id,
          member.department.name,
          member.department.managerMemberId
        ),
        member.joinedAt,
        member.phoneNumber,
        member.email,
        member.pr
      );
    });
  }
}
