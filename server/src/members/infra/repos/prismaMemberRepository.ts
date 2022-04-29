import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { MemberOrm } from '@/auth/shared/createOso';
import { DataFilter } from '@/auth/shared/dataFilter';
import {
  EditMemberDetailRepository,
  UpdatePayload,
} from '@/members/edit-member-detail/editMemberDetailRepository';
import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { ShowMemberDetailRepository } from '@/members/show-member-detail/showMemberDetailRepository';
import { MemberNotFoundError } from '@/members/useCases/errors/memberNotFoundError';
import { User } from '@/users/shared/user';
import { PrismaClient } from '@prisma/client';

export class PrismaMemberRepository
  implements ShowMemberDetailRepository, EditMemberDetailRepository
{
  private readonly prisma: PrismaClient;
  constructor(private readonly dataFilter: DataFilter, prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async updateMember(
    user: User,
    memberId: string,
    payload: UpdatePayload
  ): Promise<void> {
    await this.dataFilter.authorizedQuery(user, MEMBER_ACTIONS.READ, MemberOrm);

    await this.prisma.member.update({ where: { id: memberId }, data: payload });
  }

  async queryMember(user: User, memberId: string): Promise<Member> {
    await this.dataFilter.authorizedQuery(user, MEMBER_ACTIONS.READ, MemberOrm);

    const record = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { department: true },
    });

    if (!record) {
      throw new MemberNotFoundError(memberId);
    }

    return new Member(
      record.id,
      record.avatar,
      record.firstName,
      record.lastName,
      record.age,
      record.salary,
      new Department(
        record.department.id,
        record.department.name,
        record.department.managerMemberId
      ),
      record.joinedAt,
      record.phoneNumber,
      record.email,
      record.pr
    );
  }
}
