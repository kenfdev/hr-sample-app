import { Authorizer } from '@/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { NotAuthorizedError } from '@/auth/shared/errors/not-authorized-error';
import { DisplayableMember, Member } from '../shared/member';
import { ShowMemberDetailRepository } from './showMemberDetailRepository';

export type ShowMemberDetailRequest = {
  memberId: string;
};
export type ShowMemberDetailResponse = {
  editableFields: string[];
  member: DisplayableMember;
};

export class ShowMemberDetailService {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: ShowMemberDetailRepository
  ) {}

  async execute(
    req: ShowMemberDetailRequest
  ): Promise<ShowMemberDetailResponse> {
    const member = await this.repository.queryMember(
      this.authorizer.currentUser,
      req.memberId
    );

    try {
      const authorizedFields =
        await this.authorizer.authorizedFieldsForUser<Member>(
          MEMBER_ACTIONS.READ,
          member
        );
      const authorizedMember =
        member.createObjectWithAuthorizedFields(authorizedFields);

      const allowedActions = await this.authorizer.authorizedActionsForUser(
        member
      );

      let authorizedFieldsToUpdate: string[] = [];
      if (allowedActions.has(MEMBER_ACTIONS.UPDATE)) {
        authorizedMember.editable = true;

        const fields = await this.authorizer.authorizedFieldsForUser<Member>(
          MEMBER_ACTIONS.UPDATE,
          member
        );
        // FIXME: exclude readonly fields such as id, joinedAt
        authorizedFieldsToUpdate = Array.from(fields.values()).map((f) => f);
      }

      if (member.id === this.authorizer.currentUser.memberInfo.id) {
        authorizedMember.isLoggedInUser = true;
      }

      return {
        editableFields: authorizedFieldsToUpdate,
        member: authorizedMember,
      };
    } catch (error) {
      // TODO: return 404 NOT FOUND
      throw error;
    }
  }
}
