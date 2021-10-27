import { Authorizer } from '@/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { AuthorizedMember, Member } from '../shared/member';
import { ListAllMembersRepository } from './listAllMembersRepository';

export type ListAllMembersRequest = {};
export type ListAllMembersResponse = {
  members: AuthorizedMember[];
};

export class ListAllMembersService {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: ListAllMembersRepository
  ) {}

  async execute(): Promise<ListAllMembersResponse> {
    const members = await this.repository.queryMembers(
      this.authorizer.currentUser
    );

    const authorizedMembers: AuthorizedMember[] = [];
    for (const member of members) {
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

      authorizedMembers.push(authorizedMember);
    }

    return {
      members: authorizedMembers,
    };
  }
}
