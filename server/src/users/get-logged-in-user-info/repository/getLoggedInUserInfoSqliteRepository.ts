import { USER_MENU_ITEM_ACTIONS } from '@/auth/shared/constants/actions';
import { DataFilter } from '@/auth/shared/dataFilter';
import { UserMenuItemOrm } from '@/users/shared/typeorm/userMenuItemOrm';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { Connection } from 'typeorm';
import {
  GetLoggedInUserInfoRepository,
  UserInfo,
} from '../getLoggedInUserInfoRepository';

export class GetLoggedInUserInfoSqliteRepository
  implements GetLoggedInUserInfoRepository
{
  constructor(
    private readonly dataFilter: DataFilter,
    private readonly conn: Connection
  ) {}

  async queryUserInfo(user: User): Promise<UserInfo> {
    const userOrm = UserOrm.fromUser(user);

    const query = await this.dataFilter.authorizedQuery<UserMenuItemOrm>(
      userOrm,
      USER_MENU_ITEM_ACTIONS.READ,
      UserMenuItemOrm
    );

    const menuItems = await this.conn
      .getRepository(UserMenuItemOrm)
      .find({ select: ['name'], where: query, order: { order: 'ASC' } });

    return {
      userMenu: menuItems,
    };
  }
}
