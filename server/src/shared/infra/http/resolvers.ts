import { EditMemberDetailService } from '@/modules/members/useCases/editMemberDetail/editMemberDetailService';
import { ListAllMembersService } from '@/modules/members/useCases/listAllMembers/listAllMembersService';
import { ShowMemberDetailService } from '@/modules/members/useCases/showMemberDetail/showMemberDetailService';
import { GetLoggedInUserInfoService } from '@/modules/users/useCases/getLoggedInUserInfo/getLoggedInUserInfoService';
import { Resolvers } from './generated/resolver-types';

type Dependencies = {
  getLoggedInUserInfoService: GetLoggedInUserInfoService;
  listAllMembersService: ListAllMembersService;
  showMemberDetailService: ShowMemberDetailService;
  editMemberDetailService: EditMemberDetailService;
};

export const createResolvers = ({
  editMemberDetailService,
  getLoggedInUserInfoService,
  listAllMembersService,
  showMemberDetailService,
}: Dependencies): Resolvers => {
  return {
    Query: {
      userInfo: async () => {
        const resultOrError = await getLoggedInUserInfoService.execute();
        if (resultOrError.isFailure) {
          console.error(resultOrError.error);
          // TODO: error handling
          return;
        }
        return resultOrError.getValue();
      },
      listAllMembers: async () => {
        const resultOrError = await listAllMembersService.execute();
        if (resultOrError.isFailure) {
          console.error(resultOrError.error);
          // TODO: error handling
          return;
        }
        return resultOrError.getValue();
      },
      showMemberDetail: async (_, { id }) => {
        const resultOrError = await showMemberDetailService.execute({
          memberId: id,
        });
        if (resultOrError.isFailure) {
          console.error(resultOrError.error);
          // TODO:
          return;
        }
        return resultOrError.getValue();
      },
    },
    Mutation: {
      editMemberDetail: async (_, { input }) => {
        const { id: memberId, ...payload } = input;

        const resultOrError = await editMemberDetailService.execute({
          memberId,
          payload: {
            ...(payload.age && { age: payload.age }),
            ...(payload.departmentId && {
              departmentId: payload.departmentId,
            }),
            ...(payload.email && { email: payload.email }),
            ...(payload.firstName && { firstName: payload.firstName }),
            ...(payload.lastName && { lastName: payload.lastName }),
            ...(payload.phoneNumber && { phoneNumber: payload.phoneNumber }),
            ...(payload.pr && { pr: payload.pr }),
            ...(payload.salary && { salary: payload.salary }),
          },
        });
        if (resultOrError.isFailure) {
          console.error(resultOrError.error);
          // TODO: error handling
          return;
        }

        return resultOrError.getValue();
      },
    },
  };
};
