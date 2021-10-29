import { Authorizer } from '@/auth/shared/authorizer';
import { GetLoggedInUserInfoRepository } from './getLoggedInUserInfoRepository';

export type GetLoggedInUserInfoRequest = {};
export type GetLoggedInUserInfoResponse = {
  username: string;
  userMenu: { name: string }[];
};

export class GetLoggedInUserInfoService {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: GetLoggedInUserInfoRepository
  ) {}

  async execute(): Promise<GetLoggedInUserInfoResponse> {
    const userInfo = await this.repository.queryUserInfo(
      this.authorizer.currentUser
    );
    this.authorizer.currentUser.username;
    return {
      username: this.authorizer.currentUser.username,
      userMenu: userInfo.userMenu,
    };
  }
}
