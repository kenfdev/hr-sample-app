import { Authorizer } from '@/modules/auth/shared/authorizer';
import { NotAuthorizedError } from '@/modules/auth/shared/errors/not-authorized-error';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { GetLoggedInUserInfoRepository } from './getLoggedInUserInfoRepository';

export type GetLoggedInUserInfoRequest = {};
export type GetLoggedInUserInfoResponse = {
  username: string;
  userMenu: UserMenuItem[];
};
export type UserMenuItem = {
  name: string;
};

export class GetLoggedInUserInfoService
  implements
    UseCase<GetLoggedInUserInfoRequest, Result<GetLoggedInUserInfoResponse>>
{
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: GetLoggedInUserInfoRepository
  ) {}

  async execute(): Promise<Result<GetLoggedInUserInfoResponse>> {
    const userInfoOrError = await this.repository.queryUserInfo(
      this.authorizer.currentUser
    );
    if (userInfoOrError.isFailure) {
      if (userInfoOrError.error instanceof NotAuthorizedError) {
        return Result.ok({
          username: this.authorizer.currentUser.username,
          userMenu: [],
        });
      }
      return Result.fail(userInfoOrError.error);
    }

    return Result.ok({
      username: this.authorizer.currentUser.username,
      userMenu: userInfoOrError.getValue().userMenu,
    });
  }
}
