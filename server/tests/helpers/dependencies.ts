import { ListAllMembersService } from '@/modules/members/useCases/query/listAllMembers/listAllMembersService';
import { ShowMemberDetailService } from '@/modules/members/useCases/query/showMemberDetail/showMemberDetailService';
import { EditMemberDetailService } from '@/modules/members/useCases/command/editMemberDetail/editMemberDetailService';
import { GetLoggedInUserInfoService } from '@/modules/users/useCases/query/getLoggedInUserInfo/getLoggedInUserInfoService';

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

const MockedListAllMembersService = ListAllMembersService as jest.Mock;
const MockedShowMemberDetailService = ShowMemberDetailService as jest.Mock;
const MockedEditMemberDetailService = EditMemberDetailService as jest.Mock;
const MockedGetLoggedInUserInfoService =
  GetLoggedInUserInfoService as jest.Mock;

export class MockedDependencies {
  private readonly getLoggedInUserInfoService: jest.Mocked<GetLoggedInUserInfoService>;
  private readonly listAllMembersService: jest.Mocked<ListAllMembersService>;
  private readonly showMemberDetailService: jest.Mocked<ShowMemberDetailService>;
  private readonly editMemberDetailService: jest.Mocked<EditMemberDetailService>;

  constructor() {
    this.getLoggedInUserInfoService =
      new MockedGetLoggedInUserInfoService() as jest.Mocked<GetLoggedInUserInfoService>;
    this.listAllMembersService =
      new MockedListAllMembersService() as jest.Mocked<ListAllMembersService>;
    this.showMemberDetailService =
      new MockedShowMemberDetailService() as jest.Mocked<ShowMemberDetailService>;
    this.editMemberDetailService =
      new MockedEditMemberDetailService() as jest.Mocked<EditMemberDetailService>;
  }

  get dependencies() {
    return {
      getLoggedInUserInfoService: this.getLoggedInUserInfoService,
      listAllMembersService: this.listAllMembersService,
      showMemberDetailService: this.showMemberDetailService,
      editMemberDetailService: this.editMemberDetailService,
    };
  }

  clear() {
    MockedGetLoggedInUserInfoService.mockClear();
    MockedListAllMembersService.mockClear();
    MockedShowMemberDetailService.mockClear();
    MockedEditMemberDetailService.mockClear();
  }
}
