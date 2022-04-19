import express from 'express';
import { Authorizer } from '@/auth/shared/authorizer';
import { createCheckLoggedInMiddleware } from '@/auth/check-logged-in/checkLoggedInMiddleware';
import { MembersController } from './membersController';
import { DataFilter } from '@/auth/shared/dataFilter';
import { ListAllMembersSqliteRepository } from './list-all-members/repository/listAllMembersSqliteRepository';
import { ListAllMembersService } from './list-all-members/listAllMembersService';
import { ShowMemberDetailSqliteRepository } from './show-member-detail/repository/showMemberDetailSqliteRepository';
import { ShowMemberDetailService } from './show-member-detail/showMemberDetailService';
import { EditMemberDetailSqliteRepository } from './edit-member-detail/repository/editMemberDetailSqliteRepository';
import { EditMemberDetailService } from './edit-member-detail/editMemberDetailService';
import { asyncHandler } from '@/shared/asyncHandler';
import { PrismaClient } from '@prisma/client';

type Dependencies = {
  dataFilter: DataFilter;
  authorizer: Authorizer;
  prisma: PrismaClient;
};

export function createMembersRouter({
  dataFilter,
  authorizer,
  prisma,
}: Dependencies) {
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
  const membersController = new MembersController({
    listAllMembersService,
    showMemberDetailService,
    editMemberDetailService,
  });

  const router = express.Router();

  router.use(createCheckLoggedInMiddleware(authorizer));

  router.get('/', asyncHandler(membersController.listAllMembers));
  router.get('/:memberId', asyncHandler(membersController.showMemberDetail));
  router.patch('/:memberId', asyncHandler(membersController.editMemberDetail));

  return router;
}
