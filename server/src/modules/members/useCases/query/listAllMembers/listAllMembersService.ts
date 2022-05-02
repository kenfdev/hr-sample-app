import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { MemberDTO } from '../../../dtos/memberDTO';
import { DisplayableMember } from '../../../dtos/displayableMemberDTO';
import { MemberOrm } from '@/modules/auth/shared/createOso';
import { PrismaClient } from '@prisma/client';

export type ListAllMembersRequest = {};
export type ListAllMembersResponse = {
  members: DisplayableMember[];
};

export class ListAllMembersService
  implements UseCase<ListAllMembersRequest, Result<ListAllMembersResponse>>
{
  constructor(
    private readonly authorizer: Authorizer,
    private readonly prisma: PrismaClient
  ) {}

  async execute(): Promise<Result<ListAllMembersResponse>> {
    const query = await this.authorizer.authorizedQueryForUser(
      MEMBER_ACTIONS.READ,
      MemberOrm
    );
    const memberModels = await this.prisma.member.findMany({
      where: query,
      include: {
        department: true,
      },
    });

    const displayableMembers: DisplayableMember[] = [];
    for (const memberModel of memberModels) {
      const memberDto = MemberDTO.createFromOrmModel(memberModel);
      const authorizedFieldsOrError =
        await this.authorizer.authorizedFieldsForUser<MemberDTO>(
          MEMBER_ACTIONS.READ,
          memberDto
        );
      if (authorizedFieldsOrError.isFailure) {
        return Result.fail(authorizedFieldsOrError.error);
      }

      const allowedActionsOrError =
        await this.authorizer.authorizedActionsForUser(memberDto);
      if (allowedActionsOrError.isFailure) {
        return Result.fail(allowedActionsOrError.error);
      }

      const displayableMember: DisplayableMember = {
        ...memberDto.createObjectWithAuthorizedFields(
          authorizedFieldsOrError.getValue()
        ),
        editable: allowedActionsOrError.getValue().has(MEMBER_ACTIONS.UPDATE),
        isLoggedInUser:
          memberDto.id === this.authorizer.currentUser.memberInfo.id,
      };

      displayableMembers.push(displayableMember);
    }

    return Result.ok({
      members: displayableMembers,
    });
  }
}
