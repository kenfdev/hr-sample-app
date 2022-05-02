import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { MemberDTO } from '../../../dtos/memberDTO';
import { DisplayableMember } from '../../../dtos/displayableMemberDTO';
import { PrismaClient } from '@prisma/client';
import { MemberOrm } from '@/modules/auth/shared/createOso';
import { MemberNotFoundError } from '../../errors/memberNotFoundError';

export type ShowMemberDetailRequest = {
  memberId: string;
};
export type ShowMemberDetailResponse = {
  editableFields: string[];
  member: DisplayableMember;
};

export class ShowMemberDetailService
  implements UseCase<ShowMemberDetailRequest, Result<ShowMemberDetailResponse>>
{
  constructor(
    private readonly authorizer: Authorizer,
    private readonly prisma: PrismaClient
  ) {}

  async execute(
    req: ShowMemberDetailRequest
  ): Promise<Result<ShowMemberDetailResponse>> {
    await this.authorizer.authorizedQueryForUser(
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

    const record = await this.prisma.member.findUnique({
      where: { id: req.memberId },
      include: { department: true },
    });

    if (!record) {
      return Result.fail(new MemberNotFoundError(req.memberId));
    }

    const memberDto = MemberDTO.createFromOrmModel(record);
    const authorizedFieldsOrError =
      await this.authorizer.authorizedFieldsForUser<MemberDTO>(
        MEMBER_ACTIONS.READ,
        memberDto
      );

    const allowedActionsOrError =
      await this.authorizer.authorizedActionsForUser(memberDto);
    if (allowedActionsOrError.isFailure) {
      return Result.fail(allowedActionsOrError.error);
    }

    const displayableMemberOrError: DisplayableMember = {
      ...memberDto.createObjectWithAuthorizedFields(
        authorizedFieldsOrError.getValue()
      ),
      editable: allowedActionsOrError.getValue().has(MEMBER_ACTIONS.UPDATE),
      isLoggedInUser:
        memberDto.id === this.authorizer.currentUser.memberInfo.id,
    };

    const editableFieldsOrError =
      await this.authorizer.authorizedFieldsForUser<MemberDTO>(
        MEMBER_ACTIONS.UPDATE,
        memberDto
      );
    if (editableFieldsOrError.isFailure) {
      return Result.fail(editableFieldsOrError.error);
    }

    // FIXME: exclude readonly fields such as id, joinedAt
    const editableFields: string[] = Array.from(
      editableFieldsOrError.getValue().values()
    );

    return Result.ok({
      editableFields: editableFields,
      member: displayableMemberOrError,
    });
  }
}
