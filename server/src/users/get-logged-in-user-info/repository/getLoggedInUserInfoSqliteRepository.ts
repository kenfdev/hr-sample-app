import { USER_MENU_ITEM_ACTIONS } from '@/auth/shared/constants/actions';
import { DataFilter } from '@/auth/shared/dataFilter';
import { UserMenuItemOrm } from '@/users/shared/typeorm/userMenuItemOrm';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { Connection } from 'typeorm';
import { GetLoggedInUserInfoRepository } from '../getLoggedInUserInfoRepository';
import { GetLoggedInUserInfoResponse } from '../getLoggedInUserInfoService';

export class GetLoggedInUserInfoSqliteRepository
  implements GetLoggedInUserInfoRepository
{
  constructor(
    private readonly dataFilter: DataFilter,
    private readonly conn: Connection
  ) {}

  async query(user: User): Promise<GetLoggedInUserInfoResponse> {
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
