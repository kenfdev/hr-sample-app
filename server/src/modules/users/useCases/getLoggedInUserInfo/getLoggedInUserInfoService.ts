import { Authorizer } from '@/modules/auth/shared/authorizer';
import { NotAuthorizedError } from '@/modules/auth/shared/errors/not-authorized-error';
import { GetLoggedInUserInfoRepository } from './getLoggedInUserInfoRepository';

export type GetLoggedInUserInfoRequest = {};
export type GetLoggedInUserInfoResponse = {
  username: string;
  userMenu: UserMenuItem[];
};
export type UserMenuItem = {
  name: string;
};

export class GetLoggedInUserInfoService {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: GetLoggedInUserInfoRepository
  ) {}

  async execute(): Promise<GetLoggedInUserInfoResponse> {
    try {
      const userInfo = await this.repository.queryUserInfo(
        this.authorizer.currentUser
      );
      this.authorizer.currentUser.username;
      return {
        username: this.authorizer.currentUser.username,
        userMenu: userInfo.userMenu,
      };
    } catch (error) {
      if (error instanceof NotAuthorizedError) {
        return {
          username: this.authorizer.currentUser.username,
          userMenu: [],
        };
      }
      throw error;
    }
  }
}
