import { User } from '@/users/shared/user';
import { Request } from 'express';

export interface AuthorizeRepository {
  getUser(userId: string): Promise<User>;
}
