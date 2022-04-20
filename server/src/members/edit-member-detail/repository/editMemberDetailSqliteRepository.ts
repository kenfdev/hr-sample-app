import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { MemberOrm } from '@/auth/shared/createOso';
import { DataFilter } from '@/auth/shared/dataFilter';
import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { AppError, ErrorCodes } from '@/shared/appError';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { PrismaClient } from '@prisma/client';
import {
  EditMemberDetailRepository,
  UpdatePayload,
} from '../editMemberDetailRepository';

export class EditMemberDetailSqliteRepository
  implements EditMemberDetailRepository
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
    const userOrm = UserOrm.fromUser(user);

    await this.dataFilter.authorizedQuery<MemberOrm>(
      userOrm,
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

    await this.prisma.member.update({ where: { id: memberId }, data: payload });
  }

  async queryMember(memberId: string): Promise<Member> {
    const record = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: {
        department: true,
      },
    });

    if (!record) {
      throw new AppError(
        `member not found ${memberId}`,
        ErrorCodes.MEMBER_NOT_FOUND
      );
    }

    // TODO: implement helper methods
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
