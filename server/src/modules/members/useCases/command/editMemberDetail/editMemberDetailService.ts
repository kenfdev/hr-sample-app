import { Authorizer } from '@/modules/auth/shared/authorizer';
import { MEMBER_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { MemberDTO } from '../../../dtos/memberDTO';
import { MemberNothingToUpdateError } from '../../errors/memberNothingToUpdateError';
import {
  EditMemberDetailRepository,
  UpdatePayload,
} from './editMemberDetailRepository';
import z from 'zod';

export const editMemberDetailPayloadSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().optional(),
  salary: z.number().optional(),
  departmentId: z.string().uuid().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  pr: z.string().optional(),
});

export type EditMemberDetailRequest = {
  memberId: string;
  payload: z.infer<typeof editMemberDetailPayloadSchema>;
};
export type EditMemberDetailResponse = {
  result: boolean;
};

export class EditMemberDetailService
  implements UseCase<EditMemberDetailRequest, Result<EditMemberDetailResponse>>
{
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: EditMemberDetailRepository
  ) {}

  async execute({
    memberId,
    payload,
  }: EditMemberDetailRequest): Promise<Result<EditMemberDetailResponse>> {
    const memberOrError = await this.repository.queryMember(memberId);
    if (memberOrError.isFailure) {
      return Result.fail(memberOrError.error);
    }

    const authorizedFieldsOrError =
      await this.authorizer.authorizedFieldsForUser<MemberDTO>(
        MEMBER_ACTIONS.UPDATE,
        memberOrError.getValue()
      );
    if (authorizedFieldsOrError.isFailure) {
      return Result.fail(authorizedFieldsOrError.error);
    }

    const authorizedFields = authorizedFieldsOrError.getValue();

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

    await this.repository.updateMember(memberId, authorizedPayload);

    return Result.ok({
      result: true,
    });
  }
}
