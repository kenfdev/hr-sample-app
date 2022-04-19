import { USER_MENU_ITEM_ACTIONS } from '@/auth/shared/constants/actions';
import { UserMenuItemOrm, UserOrm } from '@/auth/shared/createOso';
import { DataFilter } from '@/auth/shared/dataFilter';
import { User } from '@/users/shared/user';
import { PrismaClient } from '@prisma/client';
import {
  GetLoggedInUserInfoRepository,
  UserInfo,
} from '../getLoggedInUserInfoRepository';

export class GetLoggedInUserInfoSqliteRepository
  implements GetLoggedInUserInfoRepository
{
  constructor(
    private readonly dataFilter: DataFilter,
    private readonly prisma: PrismaClient
  ) {}

  async queryUserInfo(user: User): Promise<UserInfo> {
    const userModel = UserOrm.fromEntity(user);

    const query = await this.dataFilter.authorizedQuery(
      userModel,
      USER_MENU_ITEM_ACTIONS.READ,
      UserMenuItemOrm
    );

    const menuItems = await this.prisma.userMenuItem.findMany({
      select: {
        name: true,
      },
      where: query,
      orderBy: { order: 'asc' },
    });

    return {
      userMenu: menuItems,
    };
  }
}
