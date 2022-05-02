import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { MemberOrm } from '@/modules/auth/shared/createOso';
import { Result } from '@/shared/core/result';
import { PrismaClient } from '@prisma/client';
import { Department } from '../../dtos/departmentDTO';
import { Member } from '../../dtos/memberDTO';
import {
  EditMemberDetailRepository,
  UpdatePayload,
} from '../../useCases/command/editMemberDetail/editMemberDetailRepository';
import { MemberNotFoundError } from '../../useCases/errors/memberNotFoundError';

export class PrismaMemberRepository implements EditMemberDetailRepository {
  private readonly prisma: PrismaClient;
  constructor(private readonly authorizer: Authorizer, prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async updateMember(
    memberId: string,
    payload: UpdatePayload
  ): Promise<Result<void>> {
    await this.authorizer.authorizedQueryForUser(
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

    await this.prisma.member.update({ where: { id: memberId }, data: payload });

    return Result.ok();
  }

  async queryMember(memberId: string): Promise<Result<Member>> {
    await this.authorizer.authorizedQueryForUser(
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

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
