import { USER_MENU_ITEM_ACTIONS } from '@/modules/auth/shared/constants/actions';
import { UserMenuItemOrm } from '@/modules/auth/shared/createOso';
import { DataFilter } from '@/modules/auth/shared/dataFilter';
import { UserNotFoundError } from '@/modules/auth/shared/errors/userNotFoundError';
import { Department } from '@/modules/members/domain/department';
import { Member } from '@/modules/members/domain/member';
import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/user';
import {
  GetLoggedInUserInfoRepository,
  UserInfo,
} from '../../useCases/getLoggedInUserInfo/getLoggedInUserInfoRepository';

export class PrismaUserRepository implements GetLoggedInUserInfoRepository {
  constructor(
    private readonly dataFilter: DataFilter,
    private readonly prisma: PrismaClient
  ) {}

  async queryUserInfo(user: User): Promise<UserInfo> {
    const query = await this.dataFilter.authorizedQuery(
      user,
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

  async getUser(userId: string): Promise<User> {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        member: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!userRecord) {
      throw new UserNotFoundError(userId);
    }

    // TODO: implement helper method
    const user = new User(
      userRecord.id,
      userRecord.username,
      new Member(
        userRecord.member.id,
        userRecord.member.avatar,
        userRecord.member.firstName,
        userRecord.member.lastName,
        userRecord.member.age,
        userRecord.member.salary,
        new Department(
          userRecord.member.department.id,
          userRecord.member.department.name,
          userRecord.member.department.managerMemberId
        ),
        userRecord.member.joinedAt,
        userRecord.member.phoneNumber,
        userRecord.member.email,
        userRecord.member.pr
      ),
      userRecord.isAdmin
    );

    return user;
  }
}
