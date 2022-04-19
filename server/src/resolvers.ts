import { Resolvers } from './generated/resolver-types';

export const resolvers: Resolvers = {
  Query: {
    userInfo: async (_, __, context) => {
      try {
        const result = await context.getLoggedInUserInfoService.execute();
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    listAllMembers: async (_, __, { listAllMembersService }) => {
      try {
        const result = await listAllMembersService.execute();
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    showMemberDetail: async (_, { id }, { showMemberDetailService }) => {
      try {
        const result = await showMemberDetailService.execute({ memberId: id });
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
  Mutation: {
    editMemberDetail: async (_, { input }, { editMemberDetailService }) => {
      try {
        const { id: memberId, ...payload } = input;

        const result = await editMemberDetailService.execute({
          memberId,
          payload: {
            ...(payload.age && { age: payload.age }),
            ...(payload.departmentId && { departmentId: payload.departmentId }),
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
