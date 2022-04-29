import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { Member } from '../../dtos/memberDTO';
import { DisplayableMember } from '../../dtos/displayableMemberDTO';
import { DataFilter } from '@/modules/auth/shared/dataFilter';
import { MemberOrm } from '@/modules/auth/shared/createOso';
import { PrismaClient } from '@prisma/client';

export type ListAllMembersRequest = {};
export type ListAllMembersResponse = {
  members: Partial<Member>[];
};

export class ListAllMembersService
  implements UseCase<ListAllMembersRequest, Result<ListAllMembersResponse>>
{
  constructor(
    private readonly authorizer: Authorizer,
    private readonly dataFilter: DataFilter,
    private readonly prisma: PrismaClient
  ) {}

  async execute(): Promise<Result<ListAllMembersResponse>> {
    const query = await this.dataFilter.authorizedQuery(
      this.authorizer.currentUser,
      MEMBER_ACTIONS.READ,
      MemberOrm
    );
    const memberModels = await this.prisma.member.findMany({
      where: query,
      include: {
        department: true,
      },
    });

    const authorizedMembers: DisplayableMember[] = [];
    for (const memberModel of memberModels) {
      const memberDto = Member.createFromOrmModel(memberModel);
      const authorizedFieldsOrError =
        await this.authorizer.authorizedFieldsForUser<Member>(
          MEMBER_ACTIONS.READ,
          memberDto
        );
      if (authorizedFieldsOrError.isFailure) {
        return Result.fail(authorizedFieldsOrError.error);
      }

      const authorizedMember: DisplayableMember = {
        ...memberDto.createObjectWithAuthorizedFields(
          authorizedFieldsOrError.getValue()
        ),
        editable: false,
        isLoggedInUser: false,
      };

      const allowedActionsOrError =
        await this.authorizer.authorizedActionsForUser(memberModel);
      if (allowedActionsOrError.isFailure) {
        return Result.fail(allowedActionsOrError.error);
      }

      if (allowedActionsOrError.getValue().has(MEMBER_ACTIONS.UPDATE)) {
        authorizedMember.editable = true;
      }

      if (memberModel.id === this.authorizer.currentUser.memberInfo.id) {
        authorizedMember.isLoggedInUser = true;
      }

      authorizedMembers.push(authorizedMember);
    }

    return Result.ok({
      members: authorizedMembers,
    });
  }
}
