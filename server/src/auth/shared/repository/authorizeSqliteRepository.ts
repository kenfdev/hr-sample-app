import { AppError, ErrorCodes } from '@/shared/appError';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { Connection, Repository } from 'typeorm';
import { AuthorizeRepository } from '../authorizeRepository';

export class AuthorizeSqliteRepository implements AuthorizeRepository {
  private readonly usersRepository: Repository<UserOrm>;
  constructor(conn: Connection) {
    this.usersRepository = conn.getRepository(UserOrm);
  }

  async getUser(userId: string): Promise<User> {
    const userRecord = await this.usersRepository.findOne(userId, {
      relations: ['member', 'member.department'],
    });
    if (!userRecord) {
      throw new AppError(
        `user id ${userId} not found`,
        ErrorCodes.USER_NOT_FOUND
      );
    }
    const user = userRecord.toUser();
    return user;
  }
}
