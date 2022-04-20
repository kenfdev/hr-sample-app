import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { AppError, ErrorCodes } from '@/shared/appError';
import { User } from '@/users/shared/user';
import { PrismaClient } from '@prisma/client';
import { AuthorizeRepository } from '../authorizeRepository';

export class AuthorizeSqliteRepository implements AuthorizeRepository {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
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
      throw new AppError(
        `user id ${userId} not found`,
        ErrorCodes.USER_NOT_FOUND
      );
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
