import { Authorizer } from '@/auth/shared/authorizer';
import {
  createCoreOso,
  createSqliteDataFilterOso,
} from '@/auth/shared/createOso';
import { AuthorizeSqliteRepository } from '@/auth/shared/repository/authorizeSqliteRepository';
import { OsoDataFilter } from '@/auth/shared/repository/osoDataFilter';
import { createUsersRouter } from '@/users/usersRouter';
import { Application } from 'express';
import request from 'supertest';
import { createExpressApp } from '../../helpers/express';
import { tearDownDatabase } from 'typeorm-seeding';
import { USERS } from '@/database/constants';
import { setupDatabase } from '../../helpers/database';

describe('UserInfo', () => {
  let app: Application;

  beforeAll(async () => {
    const connection = await setupDatabase();

    const oso = await createCoreOso();
    const authorizeRepository = new AuthorizeSqliteRepository(connection);
    const authorizer = new Authorizer(authorizeRepository, oso);

    const dataFilterOso = await createSqliteDataFilterOso(connection);
    const dataFilter = new OsoDataFilter(dataFilterOso);

    // users
    const usersRouter = createUsersRouter({
      dataFilter,
      authorizer,
      connection,
    });

    app = createExpressApp();
    app.use('/users', usersRouter);
  });

  afterAll(async () => {
    await tearDownDatabase();
  });

  describe('Unauthorized request', () => {
    it('should return 401 status code', (done) => {
      request(app).get('/users/info').expect(401, done);
    });
  });
  describe('Authorized request', () => {
    it('should return 200 status code', async () => {
      await request(app)
        .get('/users/info')
        .set('x-user-id', USERS.nonAdminAndHr.userId)
        .expect(200);
    });

    it('should return different number of menu items depending if the user is admin or not', async () => {
      const nonAdminResponse = await request(app)
        .get('/users/info')
        .set('x-user-id', USERS.nonAdminAndHr.userId)
        .expect(200);

      const { userMenu: nonAdminUserMenu } = nonAdminResponse.body;
      expect(nonAdminUserMenu).toBeDefined();
      expect(nonAdminUserMenu).toBeInstanceOf(Array);

      const adminResponse = await request(app)
        .get('/users/info')
        .set('x-user-id', USERS.adminAndItSec.userId)
        .expect(200);

      const { userMenu: adminUserMenu } = adminResponse.body;
      expect(adminUserMenu).toBeDefined();
      expect(adminUserMenu).toBeInstanceOf(Array);

      expect(adminUserMenu.length).toBeGreaterThan(nonAdminUserMenu.length);
    });
  });
});
