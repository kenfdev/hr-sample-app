import { User } from '../shared/user';
import { GetLoggedInUserInfoResponse } from './getLoggedInUserInfoService';

export interface GetLoggedInUserInfoRepository {
  query(user: User): Promise<GetLoggedInUserInfoResponse>;
}
