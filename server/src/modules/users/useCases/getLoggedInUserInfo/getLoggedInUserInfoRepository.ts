import { Result } from '@/shared/core/result';
import { User } from '../../dtos/userDTO';

export type UserInfo = {
  userMenu: { name: string }[];
};
export interface GetLoggedInUserInfoRepository {
  queryUserInfo(user: User): Promise<Result<UserInfo>>;
}
