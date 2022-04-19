import { PrismaClient } from '@prisma/client';
import { Authorizer } from './auth/shared/authorizer';
import { DataFilter } from './auth/shared/dataFilter';
import { EditMemberDetailService } from './members/edit-member-detail/editMemberDetailService';
import { EditMemberDetailSqliteRepository } from './members/edit-member-detail/repository/editMemberDetailSqliteRepository';
import { ListAllMembersService } from './members/list-all-members/listAllMembersService';
import { ListAllMembersSqliteRepository } from './members/list-all-members/repository/listAllMembersSqliteRepository';
import { ShowMemberDetailSqliteRepository } from './members/show-member-detail/repository/showMemberDetailSqliteRepository';
import { ShowMemberDetailService } from './members/show-member-detail/showMemberDetailService';
import { GetLoggedInUserInfoService } from './users/get-logged-in-user-info/getLoggedInUserInfoService';
import { GetLoggedInUserInfoSqliteRepository } from './users/get-logged-in-user-info/repository/getLoggedInUserInfoSqliteRepository';

type Dependencies = {
  dataFilter: DataFilter;
  authorizer: Authorizer;
  prisma: PrismaClient;
};

export const createContext =
  ({ dataFilter, authorizer, prisma }: Dependencies) =>
  async ({ req }: any): Promise<Context> => {
    const getLoggedInUserInfoRepository =
      new GetLoggedInUserInfoSqliteRepository(dataFilter, prisma);
    const getLoggedInUserInfoService = new GetLoggedInUserInfoService(
      authorizer,
      getLoggedInUserInfoRepository
    );

    const listAllMembersRepository = new ListAllMembersSqliteRepository(
      dataFilter,
      prisma
    );
    const listAllMembersService = new ListAllMembersService(
      authorizer,
      listAllMembersRepository
    );
    const showMemberDetailRepository = new ShowMemberDetailSqliteRepository(
      dataFilter,
      prisma
    );
    const showMemberDetailService = new ShowMemberDetailService(
      authorizer,
      showMemberDetailRepository
    );
    const editMemberDetailRepository = new EditMemberDetailSqliteRepository(
      dataFilter,
      prisma
    );
    const editMemberDetailService = new EditMemberDetailService(
      authorizer,
      editMemberDetailRepository
    );

    return {
      getLoggedInUserInfoService,
      listAllMembersService,
      showMemberDetailService,
      editMemberDetailService,
    };
  };

export interface Context {
  getLoggedInUserInfoService: GetLoggedInUserInfoService;
  listAllMembersService: ListAllMembersService;
  showMemberDetailService: ShowMemberDetailService;
  editMemberDetailService: EditMemberDetailService;
}
