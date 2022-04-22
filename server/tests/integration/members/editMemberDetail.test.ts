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
// import { USERS } from '@/database/constants';
// import { createMembersRouter } from '@/members/membersRouter';
// import { authorizeRequest } from '../../helpers/request';
// import { Connection } from 'typeorm';
// import { setupDatabase } from '../../helpers/database';
// import { apiErrorHandler } from '@/shared/apiError';

describe('EditMemberDetail', () => {
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
  //   app.use(apiErrorHandler);
  // });

  // afterAll(async () => {
  //   await tearDownDatabase();
  // });

  // describe('Unauthorized request', () => {
  //   it('should return 401 status code', async () => {
  //     await request(app)
  //       .patch(`/members/${USERS.nonAdminAndHr.memberId}`)
  //       .expect(401);
  //   });
  // });
  // describe('Authorized request', () => {
  //   const targetMember = USERS.nonAdminAndEngineer;
  //   let targetMemberBeforeUpdate: any;
  //   beforeAll(async () => {
  //     const result = await authorizeRequest(
  //       request(app).get(`/members/${targetMember.memberId}`),
  //       targetMember.userId
  //     );
  //     targetMemberBeforeUpdate = result.body.member;
  //   });

  //   describe('non HR member', () => {
  //     describe('member is not the logged in user', () => {
  //       it("cannot edit other member's information", async () => {
  //         await authorizeRequest(
  //           request(app).patch(`/members/${targetMember.memberId}`),
  //           USERS.adminAndItSec.userId
  //         )
  //           .send({
  //             firstName: 'Bob',
  //           })
  //           .expect(400);
  //       });
  //     });
  //     describe('member is the logged in user', () => {
  //       let updateResult: request.Response;
  //       let updatedMemberResult: request.Response;
  //       const expectedResult = {
  //         firstName: 'John',
  //         lastName: 'Doe',
  //       };

  //       describe('update fields', () => {
  //         beforeAll(async () => {
  //           updateResult = await authorizeRequest(
  //             request(app).patch(`/members/${targetMember.memberId}`),
  //             targetMember.userId
  //           ).send({
  //             firstName: expectedResult.firstName,
  //             lastName: expectedResult.lastName,
  //             salary: targetMemberBeforeUpdate.salary * 10,
  //           });

  //           updatedMemberResult = await authorizeRequest(
  //             request(app).get(`/members/${targetMember.memberId}`),
  //             targetMember.userId
  //           );
  //         });

  //         it('returns 200', async () => {
  //           expect(updateResult.statusCode).toBe(200);
  //         });

  //         it("should update the member's public fields", () => {
  //           const { member } = updatedMemberResult.body;
  //           expect(member.firstName).toBe(expectedResult.firstName);
  //           expect(member.lastName).toBe(expectedResult.lastName);
  //         });

  //         it("should not update the member's private fields (like salary)", () => {
  //           const { member } = updatedMemberResult.body;
  //           expect(member.salary).toBe(targetMemberBeforeUpdate.salary);
  //         });
  //       });
  //     });
  //   });

  //   describe('HR member', () => {
  //     describe('update fields', () => {
  //       let updateResult: request.Response;
  //       let updatedMemberResult: request.Response;
  //       const hrUser = USERS.nonAdminAndHr;
  //       const expectedResult = {
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         salary: 1000000,
  //         age: 100,
  //       };
  //       beforeAll(async () => {
  //         updateResult = await authorizeRequest(
  //           request(app).patch(`/members/${targetMember.memberId}`),
  //           hrUser.userId
  //         ).send({
  //           firstName: expectedResult.firstName,
  //           lastName: expectedResult.lastName,
  //           salary: expectedResult.salary,
  //           age: expectedResult.age,
  //         });

  //         updatedMemberResult = await authorizeRequest(
  //           request(app).get(`/members/${targetMember.memberId}`),
  //           targetMember.userId
  //         );
  //       });

  //       it('returns 200', async () => {
  //         expect(updateResult.statusCode).toBe(200);
  //       });

  //       it("should update the member's public fields", () => {
  //         const { member } = updatedMemberResult.body;
  //         expect(member.firstName).toBe(expectedResult.firstName);
  //         expect(member.lastName).toBe(expectedResult.lastName);
  //       });

  //       it("should update the member's private fields (like salary)", () => {
  //         const { member } = updatedMemberResult.body;
  //         expect(member.salary).toBe(expectedResult.salary);
  //         expect(member.age).toBe(expectedResult.age);
  //       });
  //     });
  //   });
  // });
});
