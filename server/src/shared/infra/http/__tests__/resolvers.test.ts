import { createGraphQLServer } from '@/shared/infra/http/app';
import { ListAllMembersService } from '@/modules/members/useCases/query/listAllMembers/listAllMembersService';
import { ShowMemberDetailService } from '@/modules/members/useCases/query/showMemberDetail/showMemberDetailService';
import { EditMemberDetailService } from '@/modules/members/useCases/command/editMemberDetail/editMemberDetailService';
import { GetLoggedInUserInfoService } from '@/modules/users/useCases/query/getLoggedInUserInfo/getLoggedInUserInfoService';
import { Result } from '@/shared/core/result';

jest.mock(
  '@/modules/members/useCases/query/listAllMembers/listAllMembersService'
);
jest.mock(
  '@/modules/members/useCases/query/showMemberDetail/showMemberDetailService'
);
jest.mock(
  '@/modules/members/useCases/command/editMemberDetail/editMemberDetailService'
);
jest.mock(
  '@/modules/users/useCases/query/getLoggedInUserInfo/getLoggedInUserInfoService'
);

// const MockedListAllMembersService = ListAllMembersService as jest.MockedClass<
//   typeof ListAllMembersService
// >;
const MockedListAllMembersService = ListAllMembersService as jest.Mock;
const MockedShowMemberDetailService = ShowMemberDetailService as jest.Mock;
const MockedEditMemberDetailService = EditMemberDetailService as jest.Mock;
const MockedGetLoggedInUserInfoService =
  GetLoggedInUserInfoService as jest.Mock;

describe('resolvers', () => {
  beforeEach(() => {
    MockedListAllMembersService.mockClear();
    MockedShowMemberDetailService.mockClear();
    MockedEditMemberDetailService.mockClear();
    MockedGetLoggedInUserInfoService.mockClear();
  });

  test('test', async () => {
    // MockedGetLoggedInUserInfoService.mockImplementation(() => {
    //   return {
    //     prisma: null,
    //     authorizer: null,
    //     execute: async () => Result.ok({ username: 'test', userMenu: [] }),
    //   };
    // });

    const mock =
      new MockedGetLoggedInUserInfoService() as jest.Mocked<GetLoggedInUserInfoService>;
    mock.execute.mockResolvedValue(
      Result.ok({ username: 'test', userMenu: [] })
    );

    const server = await createGraphQLServer({
      getLoggedInUserInfoService: mock,
      listAllMembersService: new MockedListAllMembersService(),
      showMemberDetailService: new MockedShowMemberDetailService(),
      editMemberDetailService: new MockedEditMemberDetailService(),
    });

    const response = await server.fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query {
          userInfo {
            username
            userMenu {
              name
            }
          }
        }`,
      }),
    });

    console.log('response', response);
    expect(response.status).toBe(200);
    const executionResult = await response.json();
    console.log('executionResult', executionResult);
    // expect(executionResult).toEqual({
    //   data: {
    //     getLoggedInUserInfo: {
  });
});
