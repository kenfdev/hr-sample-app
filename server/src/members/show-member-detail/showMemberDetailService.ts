import { Authorizer } from '@/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { AuthorizedMember, Member } from '../shared/member';
import { ShowMemberDetailRepository } from './showMemberDetailRepository';

export type ShowMemberDetailRequest = {
  memberId: string;
};
export type ShowMemberDetailResponse = {
  member: AuthorizedMember;
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
    if (allowedActions.has(MEMBER_ACTIONS.UPDATE)) {
      authorizedMember.editable = true;
    }

    return {
      member: authorizedMember,
    };
  }
}
