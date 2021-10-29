import { User } from '../shared/user';

export type UserInfo = {
  userMenu: { name: string }[];
};
export interface GetLoggedInUserInfoRepository {
  queryUserInfo(user: User): Promise<UserInfo>;
}
