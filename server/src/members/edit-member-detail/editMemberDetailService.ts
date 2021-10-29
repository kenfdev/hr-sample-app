import { Authorizer } from '@/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { AppError, ErrorCodes } from '@/shared/appError';
import { DisplayableMember, Member } from '../shared/member';
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

    const authorizedPayload: UpdatePayload = {};

    // have to check if the field is included in the payload
    // because TypeOrm will try to set undefined values
    // which will lead to unpredictable consequences
    if (authorizedFields.has('firstName') && 'firstName' in payload)
      authorizedPayload.firstName = payload.firstName;
    if (authorizedFields.has('lastName') && 'lastName' in payload)
      authorizedPayload.lastName = payload.lastName;
    if (authorizedFields.has('phoneNumber') && 'phoneNumber' in payload)
      authorizedPayload.phoneNumber = payload.phoneNumber;
    if (authorizedFields.has('email') && 'email' in payload)
      authorizedPayload.email = payload.email;
    if (authorizedFields.has('pr') && 'pr' in payload)
      authorizedPayload.pr = payload.pr;
    if (authorizedFields.has('age') && 'age' in payload)
      authorizedPayload.age = payload.age;
    if (authorizedFields.has('salary') && 'salary' in payload)
      authorizedPayload.salary = payload.salary;
    if (authorizedFields.has('department') && 'departmentId' in payload)
      authorizedPayload.departmentId = payload.departmentId;

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
