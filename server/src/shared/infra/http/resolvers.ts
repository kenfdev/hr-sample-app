import { EditMemberDetailService } from '@/members/edit-member-detail/editMemberDetailService';
import { ListAllMembersService } from '@/members/list-all-members/listAllMembersService';
import { ShowMemberDetailService } from '@/members/show-member-detail/showMemberDetailService';
import { GetLoggedInUserInfoService } from '@/users/get-logged-in-user-info/getLoggedInUserInfoService';
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
        try {
          const result = await getLoggedInUserInfoService.execute();
          return result;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      listAllMembers: async () => {
        try {
          const result = await listAllMembersService.execute();
          return result;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      showMemberDetail: async (_, { id }) => {
        try {
          const result = await showMemberDetailService.execute({
            memberId: id,
          });
          return result;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    },
    Mutation: {
      editMemberDetail: async (_, { input }) => {
        try {
          const { id: memberId, ...payload } = input;

          const result = await editMemberDetailService.execute({
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
          return result;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    },
  };
};
