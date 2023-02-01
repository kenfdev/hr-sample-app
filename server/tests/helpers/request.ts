import { USERS } from '@/shared/infra/database/constants';
import request from 'supertest';

export function authorizeRequest(
  req: request.Test,
  userId = USERS.nonAdminAndHr.userId
): request.Test {
  return req.set('x-user-id', userId);
}
