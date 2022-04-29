import { Authorizer } from '@/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { NotAuthorizedError } from '@/auth/shared/errors/not-authorized-error';
import { Member } from '../shared/member';
import { MemberNothingToUpdateError } from '../useCases/errors/memberNothingToUpdateError';
import {
  EditMemberDetailRepository,
  UpdatePayload,
} from './editMemberDetailRepository';

export type EditMemberDetailRequest = {
  memberId: string;
  payload: UpdatePayload;
};
export type EditMemberDetailResponse = {
  result: boolean;
};

export class EditMemberDetailService {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: EditMemberDetailRepository
  ) {}

  async execute({
    memberId,
    payload,
  }: EditMemberDetailRequest): Promise<EditMemberDetailResponse> {
    try {
      const member = await this.repository.queryMember(
        this.authorizer.currentUser,
        memberId
      );

      const authorizedFields =
        await this.authorizer.authorizedFieldsForUser<Member>(
          MEMBER_ACTIONS.UPDATE,
          member
        );

      const authorizedPayload: UpdatePayload = {
        ...(authorizedFields.has('firstName') && {
          firstName: payload.firstName,
        }),
        ...(authorizedFields.has('lastName') && { lastName: payload.lastName }),
        ...(authorizedFields.has('phoneNumber') && {
          phoneNumber: payload.phoneNumber,
        }),
        ...(authorizedFields.has('email') && { email: payload.email }),
        ...(authorizedFields.has('pr') && { pr: payload.pr }),
        ...(authorizedFields.has('age') && { age: payload.age }),
        ...(authorizedFields.has('salary') && { salary: payload.salary }),
      };

      if (Object.keys(authorizedPayload).length === 0) {
        throw new MemberNothingToUpdateError(memberId);
      }

      await this.repository.updateMember(
        this.authorizer.currentUser,
        memberId,
        authorizedPayload
      );

      return {
        result: true,
      };
    } catch (error) {
      if (error instanceof NotAuthorizedError) {
        return { result: false };
      }
      throw error;
    }
  }
}
