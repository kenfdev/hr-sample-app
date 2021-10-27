import request from 'supertest';
import { USERS } from '@/database/constants';

export function authorizeRequest(
  req: request.Test,
  userId = USERS.nonAdminAndHr.userId
): request.Test {
  return req.set('x-user-id', userId);
}
