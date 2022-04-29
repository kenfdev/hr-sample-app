import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { MemberOrm } from '@/modules/auth/shared/createOso';
import { DataFilter } from '@/modules/auth/shared/dataFilter';
import { User } from '@/modules/users/dtos/userDTO';
import { Result } from '@/shared/core/result';
import { PrismaClient } from '@prisma/client';
import { Department } from '../../dtos/departmentDTO';
import { Member } from '../../dtos/memberDTO';
import {
  EditMemberDetailRepository,
  UpdatePayload,
} from '../../useCases/editMemberDetail/editMemberDetailRepository';
import { MemberNotFoundError } from '../../useCases/errors/memberNotFoundError';

export class PrismaMemberRepository implements EditMemberDetailRepository {
  private readonly prisma: PrismaClient;
  constructor(private readonly dataFilter: DataFilter, prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async updateMember(
    user: User,
    memberId: string,
    payload: UpdatePayload
  ): Promise<Result<void>> {
    await this.dataFilter.authorizedQuery(user, MEMBER_ACTIONS.READ, MemberOrm);

    await this.prisma.member.update({ where: { id: memberId }, data: payload });

    return Result.ok();
  }

  async queryMember(user: User, memberId: string): Promise<Result<Member>> {
    await this.dataFilter.authorizedQuery(user, MEMBER_ACTIONS.READ, MemberOrm);

    const record = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { department: true },
    });

    if (!record) {
      throw new MemberNotFoundError(memberId);
    }

    const member = new Member(
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
    return Result.ok(member);
  }
}
