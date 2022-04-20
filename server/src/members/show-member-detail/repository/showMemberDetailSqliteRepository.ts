import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { MemberOrm } from '@/auth/shared/createOso';
import { DataFilter } from '@/auth/shared/dataFilter';
import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { AppError, ErrorCodes } from '@/shared/appError';
import { User } from '@/users/shared/user';
import { PrismaClient } from '@prisma/client';
import { ShowMemberDetailRepository } from '../showMemberDetailRepository';

export class ShowMemberDetailSqliteRepository
  implements ShowMemberDetailRepository
{
  private readonly prisma: PrismaClient;
  constructor(private readonly dataFilter: DataFilter, prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async queryMember(user: User, memberId: string): Promise<Member> {
    await this.dataFilter.authorizedQuery<MemberOrm>(
      user,
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

    const record = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { department: true },
    });

    if (!record) {
      throw new AppError(
        `member not found ${memberId}`,
        ErrorCodes.MEMBER_NOT_FOUND
      );
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
