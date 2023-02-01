import {
  GetLoggedInUserInfoResponse,
  GetLoggedInUserInfoService,
} from '@/modules/users/useCases/query/getLoggedInUserInfo/getLoggedInUserInfoService';
import { Result } from '@/shared/core/result';
import {
  EditMemberDetailInput,
  Mutation,
  Query,
} from '@/shared/infra/http/generated/resolver-types';
import { runQuery } from '@/../tests/helpers/graphql';
import { MockedDependencies } from '@/../tests/helpers/dependencies';
import { ListAllMembersResponse } from '@/modules/members/useCases/query/listAllMembers/listAllMembersService';
import { displayableMemberFactory } from '@/../tests/factories/member';
import { ShowMemberDetailResponse } from '@/modules/members/useCases/query/showMemberDetail/showMemberDetailService';
import faker from '@faker-js/faker';

describe('resolvers', () => {
  let mockContainer: MockedDependencies;

  beforeEach(() => {
    mockContainer = new MockedDependencies();
    mockContainer.clear();
  });

  describe('Query', () => {
    describe('userInfo', () => {
      it('should call GetLoggedInUserInfoService', async () => {
        const { dependencies } = mockContainer;

        const expectedResponse: GetLoggedInUserInfoResponse = {
          username: 'test',
          userMenu: [],
        };

        dependencies.getLoggedInUserInfoService.execute.mockResolvedValue(
          Result.ok(expectedResponse)
        );

        const response = await runQuery<Query>(
          {
            query: `
        query {
          userInfo {
            username
            userMenu {
              name
            }
          }
        }
        `,
          },
          {
            dependencies,
          }
        );

        expect(response.status).toBe(200);
        const executionResult = await response.json();
        expect(executionResult.data).toEqual<typeof executionResult['data']>({
          userInfo: expectedResponse,
        });
      });
    });

    describe('listAllMembers', () => {
      it('should call ListAllMembersService', async () => {
        const { dependencies } = mockContainer;

        const expectedResponse: ListAllMembersResponse = {
          members: displayableMemberFactory.buildList(2),
        };

        dependencies.listAllMembersService.execute.mockResolvedValue(
          Result.ok(expectedResponse)
        );

        const response = await runQuery<Query>(
          {
            query: `
        query {
          listAllMembers {
            members {
              id
              avatar
              firstName
              lastName
              age
              salary
              department {
                id
                name
                managerMemberId
              }
              joinedAt
              phoneNumber
              email
              pr
              editable
              isLoggedInUser
            }
          }
        }
        `,
          },
          {
            dependencies,
          }
        );

        expect(response.status).toBe(200);
        const executionResult = await response.json();
        expect(executionResult.data).toEqual({
          listAllMembers: {
            members: expectedResponse.members.map((member) => ({
              ...member,
              joinedAt: member.joinedAt?.toISOString(),
            })),
          },
        });
      });
    });

    describe('showMemberDetail', () => {
      it('should call ShowMemberDetailService', async () => {
        const { dependencies } = mockContainer;

        const expectedResponse: ShowMemberDetailResponse = {
          member: displayableMemberFactory.build(),
          editableFields: [],
        };

        dependencies.showMemberDetailService.execute.mockResolvedValue(
          Result.ok(expectedResponse)
        );

        const response = await runQuery<Query>(
          {
            query: `
        query {
          showMemberDetail(id: "1") {
            member {
              id
              avatar
              firstName
              lastName
              age
              salary
              department {
                id
                name
                managerMemberId
              }
              joinedAt
              phoneNumber
              email
              pr
              editable
              isLoggedInUser
            }
          }
        }
        `,
          },
          {
            dependencies,
          }
        );

        expect(response.status).toBe(200);
        const executionResult = await response.json();
        expect(executionResult.data).toEqual({
          showMemberDetail: {
            member: {
              ...expectedResponse.member,
              joinedAt: expectedResponse.member.joinedAt?.toISOString(),
            },
          },
        });
      });
    });
  });

  describe('Mutation', () => {
    describe('editMemberDetail', () => {
      it('should call editMemberDetailService with valid payload', async () => {
        // Arrange
        const { dependencies } = mockContainer;
        dependencies.editMemberDetailService.execute.mockResolvedValue(
          Result.ok({ result: true })
        );

        // Act
        const response = await runQuery<Mutation>(
          {
            query: `
        mutation ($input: EditMemberDetailInput!) {
          editMemberDetail(input: $input) {
            result
          }
        }`,
            variables: { input: createEditMemberDetailInput() },
          },
          {
            dependencies: dependencies,
          }
        );

        // Assert
        expect(response.status).toBe(200);
        const executionResult = await response.json();
        expect(executionResult.data).toEqual({
          editMemberDetail: {
            result: true,
          },
        });
      });

      it('should call editMemberDetailService with invalid payload', async () => {
        // Arrange
        const { dependencies } = mockContainer;
        dependencies.editMemberDetailService.execute.mockResolvedValue(
          Result.fail(new Error('invalid payload'))
        );

        // Act
        const response = await runQuery<Mutation>(
          {
            query: `
        mutation ($input: EditMemberDetailInput!) {
          editMemberDetail(input: $input) {
            result
          }
        }`,
            variables: { input: createEditMemberDetailInput() },
          },
          {
            dependencies: dependencies,
          }
        );

        // Assert
        expect(response.status).toBe(200);
        const executionResult = await response.json();
        expect(executionResult.data).toEqual({
          editMemberDetail: null,
        });
      });
    });
  });
});

function createEditMemberDetailInput(): EditMemberDetailInput {
  return {
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number(),
    salary: faker.datatype.number(),
    departmentId: faker.datatype.uuid(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    pr: faker.lorem.paragraph(),
  };
}
