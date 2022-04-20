import { Authorizer } from '@/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { AppError, ErrorCodes } from '@/shared/appError';
import { Member } from '../shared/member';
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
    const member = await this.repository.queryMember(memberId);

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
      throw new AppError(
        'nothing is able to be updated',
        ErrorCodes.BAD_REQUEST
      );
    }

    await this.repository.updateMember(
      this.authorizer.currentUser,
      memberId,
      authorizedPayload
    );

    return {
      result: true,
    };
  }
}
