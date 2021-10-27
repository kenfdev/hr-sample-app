import { Authorizer } from '@/auth/shared/authorizer';
import { UserMenuItem } from '../shared/userMenuItem';
import { GetLoggedInUserInfoRepository } from './getLoggedInUserInfoRepository';

export type GetLoggedInUserInfoRequest = {};
export type GetLoggedInUserInfoResponse = {
  userMenu: { name: string }[];
};

export class GetLoggedInUserInfoService {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly repository: GetLoggedInUserInfoRepository
  ) {}

  async execute(): Promise<GetLoggedInUserInfoResponse> {
    const result = await this.repository.query(this.authorizer.currentUser);
    return result;
  }
}
