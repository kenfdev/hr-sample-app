import {
  editMemberDetailPayloadSchema,
  EditMemberDetailService,
} from '@/modules/members/useCases/command/editMemberDetail/editMemberDetailService';
import { ListAllMembersService } from '@/modules/members/useCases/query/listAllMembers/listAllMembersService';
import { ShowMemberDetailService } from '@/modules/members/useCases/query/showMemberDetail/showMemberDetailService';
import { GetLoggedInUserInfoService } from '@/modules/users/useCases/query/getLoggedInUserInfo/getLoggedInUserInfoService';
import { Resolvers } from './generated/resolver-types';

export type Dependencies = {
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
          return null;
        }
        return resultOrError.getValue();
      },
      listAllMembers: async () => {
        const resultOrError = await listAllMembersService.execute();
        if (resultOrError.isFailure) {
          console.error(resultOrError.error);
          // TODO: error handling
          return null;
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
          return null;
        }
        return resultOrError.getValue();
      },
    },
    Mutation: {
      editMemberDetail: async (_, { input }) => {
        const { id: memberId, ...payload } = input;

        const parsedPayload = editMemberDetailPayloadSchema.safeParse(payload);
        if (!parsedPayload.success) {
          // TODO: error handling
          console.error(parsedPayload.error);
          return null;
        }

        const resultOrError = await editMemberDetailService.execute({
          memberId,
          payload: parsedPayload.data,
        });
        if (resultOrError.isFailure) {
          console.error(resultOrError.error);
          // TODO: error handling
          return null;
        }

        return resultOrError.getValue();
      },
    },
  };
};
