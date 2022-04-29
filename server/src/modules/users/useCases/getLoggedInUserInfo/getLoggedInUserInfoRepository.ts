import { Result } from '@/shared/core/result';
import { User } from '../../domain/user';

export type UserInfo = {
  userMenu: { name: string }[];
};
export interface GetLoggedInUserInfoRepository {
  queryUserInfo(user: User): Promise<Result<UserInfo>>;
}
