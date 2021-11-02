import { User } from '@/users/shared/user';

export interface AuthorizeRepository {
  getUser(userId: string): Promise<User>;
}
