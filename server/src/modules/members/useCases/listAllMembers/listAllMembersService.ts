import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { NotAuthorizedError } from '@/modules/auth/shared/errors/not-authorized-error';
import { Member } from '../../domain/member';
import { DisplayableMember } from '../../dtos/displayableMember';
import { ListAllMembersRepository } from './listAllMembersRepository';

export type ListAllMembersRequest = {};
export type ListAllMembersResponse = {
  members: Partial<Member>[];
};

export class ListAllMembersService {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: ListAllMembersRepository
  ) {}

  async execute(): Promise<ListAllMembersResponse> {
    try {
      const members = await this.repository.queryMembers(
        this.authorizer.currentUser
      );
      const authorizedMembers: DisplayableMember[] = [];
      for (const member of members) {
        const authorizedFields =
          await this.authorizer.authorizedFieldsForUser<Member>(
            MEMBER_ACTIONS.READ,
            member
          );

        const authorizedMember: DisplayableMember = {
          ...member.createObjectWithAuthorizedFields(authorizedFields),
          editable: false,
          isLoggedInUser: false,
        };

        const allowedActions = await this.authorizer.authorizedActionsForUser(
          member
        );
        if (allowedActions.has(MEMBER_ACTIONS.UPDATE)) {
          authorizedMember.editable = true;
        }

        if (member.id === this.authorizer.currentUser.memberInfo.id) {
          authorizedMember.isLoggedInUser = true;
        }

        authorizedMembers.push(authorizedMember);
      }

      return {
        members: authorizedMembers,
      };
    } catch (error) {
      if (error instanceof NotAuthorizedError) {
        return { members: [] };
      }
      throw error;
    }
  }
}
