import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { Member } from '../../dtos/memberDTO';
import { DisplayableMember } from '../../dtos/displayableMemberDTO';
import { ListAllMembersRepository } from './listAllMembersRepository';

export type ListAllMembersRequest = {};
export type ListAllMembersResponse = {
  members: Partial<Member>[];
};

export class ListAllMembersService
  implements UseCase<ListAllMembersRequest, Result<ListAllMembersResponse>>
{
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: ListAllMembersRepository
  ) {}

  async execute(): Promise<Result<ListAllMembersResponse>> {
    const membersOrError = await this.repository.queryMembers(
      this.authorizer.currentUser
    );
    if (membersOrError.isFailure) {
      return Result.fail(membersOrError.error);
    }

    const authorizedMembers: DisplayableMember[] = [];
    for (const member of membersOrError.getValue()) {
      const authorizedFieldsOrError =
        await this.authorizer.authorizedFieldsForUser<Member>(
          MEMBER_ACTIONS.READ,
          member
        );
      if (authorizedFieldsOrError.isFailure) {
        return Result.fail(authorizedFieldsOrError.error);
      }

      const authorizedMember: DisplayableMember = {
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

      if (allowedActionsOrError.getValue().has(MEMBER_ACTIONS.UPDATE)) {
        authorizedMember.editable = true;
      }

      if (member.id === this.authorizer.currentUser.memberInfo.id) {
        authorizedMember.isLoggedInUser = true;
      }

      authorizedMembers.push(authorizedMember);
    }

    return Result.ok({
      members: authorizedMembers,
    });
  }
}
