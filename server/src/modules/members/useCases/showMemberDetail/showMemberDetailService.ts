import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { Member } from '../../dtos/memberDTO';
import { DisplayableMember } from '../../dtos/displayableMemberDTO';
import { ShowMemberDetailRepository } from './showMemberDetailRepository';

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
    private readonly repository: ShowMemberDetailRepository
  ) {}

  async execute(
    req: ShowMemberDetailRequest
  ): Promise<Result<ShowMemberDetailResponse>> {
    const memberOrError = await this.repository.queryMember(
      this.authorizer.currentUser,
      req.memberId
    );
    if (memberOrError.isFailure) {
      return Result.fail(memberOrError.error);
    }

    const member = memberOrError.getValue();
    const authorizedFieldsOrError =
      await this.authorizer.authorizedFieldsForUser<Member>(
        MEMBER_ACTIONS.READ,
        member
      );

    const authorizedMemberOrError: DisplayableMember = {
      ...member.createObjectWithAuthorizedFields(
        authorizedFieldsOrError.getValue()
      ),
      editable: false,
      isLoggedInUser: false,
    };

    const allowedActionsOrError =
      await this.authorizer.authorizedActionsForUser(member);
    if (allowedActionsOrError.isFailure) {
      return Result.fail(allowedActionsOrError.error);
    }

    let authorizedFieldsToUpdate: string[] = [];
    if (allowedActionsOrError.getValue().has(MEMBER_ACTIONS.UPDATE)) {
      authorizedMemberOrError.editable = true;

      const fieldsOrError =
        await this.authorizer.authorizedFieldsForUser<Member>(
          MEMBER_ACTIONS.UPDATE,
          member
        );
      if (fieldsOrError.isFailure) {
        return Result.fail(fieldsOrError.error);
      }

      const fields = fieldsOrError.getValue();

      // FIXME: exclude readonly fields such as id, joinedAt
      authorizedFieldsToUpdate = Array.from(fields.values()).map((f) => f);
    }

    if (member.id === this.authorizer.currentUser.memberInfo.id) {
      authorizedMemberOrError.isLoggedInUser = true;
    }

    return Result.ok({
      editableFields: authorizedFieldsToUpdate,
      member: authorizedMemberOrError,
    });
  }
}
