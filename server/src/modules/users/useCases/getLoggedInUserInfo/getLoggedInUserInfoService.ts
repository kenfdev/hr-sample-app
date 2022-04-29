import { Authorizer } from '@/modules/auth/shared/authorizer';
import { USER_MENU_ITEM_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { UserMenuItemOrm } from '@/modules/auth/shared/createOso';
import { DataFilter } from '@/modules/auth/shared/dataFilter';
import { Result } from '@/shared/core/result';
import { UseCase } from '@/shared/core/useCase';
import { PrismaClient } from '@prisma/client';

export type GetLoggedInUserInfoRequest = {};
export type GetLoggedInUserInfoResponse = {
  username: string;
  userMenu: UserMenuItem[];
};
export type UserMenuItem = {
  name: string;
};

export class GetLoggedInUserInfoService
  implements
    UseCase<GetLoggedInUserInfoRequest, Result<GetLoggedInUserInfoResponse>>
{
  constructor(
    private readonly authorizer: Authorizer,
    private readonly dataFilter: DataFilter,
    private readonly prisma: PrismaClient
  ) {}

  async execute(): Promise<Result<GetLoggedInUserInfoResponse>> {
    const query = await this.dataFilter.authorizedQuery(
      this.authorizer.currentUser,
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

    return Result.ok({
      username: this.authorizer.currentUser.username,
      userMenu: menuItems,
    });
  }
}
