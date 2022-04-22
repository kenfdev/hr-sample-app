// import { Authorizer } from '@/auth/shared/authorizer';
// import {
//   createCoreOso,
//   createSqliteDataFilterOso,
// } from '@/auth/shared/createOso';
// import { AuthorizeSqliteRepository } from '@/auth/shared/repository/authorizeSqliteRepository';
// import { OsoDataFilter } from '@/auth/shared/repository/osoDataFilter';
// import { Application } from 'express';
// import request from 'supertest';
// import { createExpressApp } from '../../helpers/express';
// import { tearDownDatabase } from 'typeorm-seeding';
// import { DEPARTMENT_IDS, USERS } from '@/database/constants';
// import { createMembersRouter } from '@/members/membersRouter';
// import { authorizeRequest } from '../../helpers/request';
// import { Connection } from 'typeorm';
// import { setupDatabase } from '../../helpers/database';

describe('ListAllMembers', () => {
  // let app: Application;
  // let connection: Connection;

  // beforeAll(async () => {
  //   connection = await setupDatabase();

  //   const oso = await createCoreOso();
  //   const authorizeRepository = new AuthorizeSqliteRepository(connection);
  //   const authorizer = new Authorizer(authorizeRepository, oso);

  //   const dataFilterOso = await createSqliteDataFilterOso(connection);
  //   const dataFilter = new OsoDataFilter(dataFilterOso);

  //   const membersRouter = createMembersRouter({
  //     dataFilter,
  //     authorizer,
  //     connection,
  //   });

  //   app = createExpressApp();
  //   app.use('/members', membersRouter);
  // });

  // afterAll(async () => {
  //   await tearDownDatabase();
  // });

  // describe('Unauthorized request', () => {
  //   it('should return 401 status code', async () => {
  //     await request(app).get('/members').expect(401);
  //   });
  // });
  // describe('Authorized request', () => {
  //   describe('non HR member', () => {
  //     describe('non Manager of department', () => {
  //       let res: request.Response;
  //       let loggedInUser: typeof USERS[keyof typeof USERS];
  //       beforeAll(async () => {
  //         loggedInUser = USERS.nonAdminAndEngineer;
  //         res = await authorizeRequest(
  //           request(app).get('/members'),
  //           loggedInUser.userId
  //         ).expect(200);
  //         expect(res.body.members).toBeInstanceOf(Array);
  //         expect(res.body.members.length).toBeGreaterThan(1);
  //       });

  //       it('should return only members of the users department', async () => {
  //         const { members } = res.body;
  //         for (const member of members) {
  //           expect(member.department.id).toBe(DEPARTMENT_IDS.engineering);
  //         }
  //       });

  //       it("should omit member's private fields such as salaries except for the logged in user and should not be editable", () => {
  //         const { members } = res.body;
  //         const membersLoggedInUserExcluded = members.filter(
  //           (m: any) => m.id !== loggedInUser.memberId
  //         );
  //         for (const member of membersLoggedInUserExcluded) {
  //           expect(member.salary).toBeUndefined();
  //           expect(member.age).toBeUndefined();
  //           expect(member.editable).toBeFalsy();
  //         }
  //       });

  //       it("should not omit logged in user's private fields such as salaries and should be editable", async () => {
  //         const { members } = res.body;
  //         const loggedInUserMember = members.find(
  //           (m: any) => m.id === loggedInUser.memberId
  //         );
  //         expect(loggedInUserMember.salary).toBeDefined();
  //         expect(loggedInUserMember.age).toBeDefined();
  //         expect(loggedInUserMember.editable).toBe(true);
  //       });
  //     });
  //     describe('Manager of department', () => {
  //       let res: request.Response;
  //       let loggedInUser: typeof USERS[keyof typeof USERS];
  //       beforeAll(async () => {
  //         loggedInUser = USERS.nonAdminAndEngineerManager;
  //         res = await authorizeRequest(
  //           request(app).get('/members'),
  //           loggedInUser.userId
  //         ).expect(200);
  //         expect(res.body.members).toBeInstanceOf(Array);
  //         expect(res.body.members.length).toBeGreaterThan(1);
  //       });

  //       it('should return all members with all fields present', () => {
  //         const { members } = res.body;
  //         for (const member of members) {
  //           expect(member.salary).toBeDefined();
  //           expect(member.age).toBeDefined();
  //         }
  //       });
  //     });
  //   });
  //   describe('HR member', () => {
  //     let res: request.Response;
  //     let loggedInUser: typeof USERS[keyof typeof USERS];
  //     beforeAll(async () => {
  //       loggedInUser = USERS.nonAdminAndHr;
  //       res = await authorizeRequest(
  //         request(app).get('/members'),
  //         loggedInUser.userId
  //       ).expect(200);
  //       expect(res.body.members).toBeInstanceOf(Array);
  //     });

  //     it('should return all members with all fields present', () => {
  //       const { members } = res.body;
  //       for (const member of members) {
  //         expect(member.salary).toBeDefined();
  //         expect(member.age).toBeDefined();
  //       }
  //     });
  //   });
  // });
});
