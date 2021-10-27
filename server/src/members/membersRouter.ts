import express, { NextFunction, Request, Response } from 'express';
import { Authorizer } from '@/auth/shared/authorizer';
import { createCheckLoggedInMiddleware } from '@/auth/check-logged-in/checkLoggedInMiddleware';
import { MembersController } from './membersController';
import { DataFilter } from '@/auth/shared/dataFilter';
import { Connection } from 'typeorm';
import { ListAllMembersSqliteRepository } from './list-all-members/repository/listAllMembersSqliteRepository';
import { ListAllMembersService } from './list-all-members/listAllMembersService';
import { ShowMemberDetailSqliteRepository } from './show-member-detail/repository/showMemberDetailSqliteRepository';
import { ShowMemberDetailService } from './show-member-detail/showMemberDetailService';
import { EditMemberDetailSqliteRepository } from './edit-member-detail/repository/editMemberDetailSqliteRepository';
import { EditMemberDetailService } from './edit-member-detail/editMemberDetailService';
import { AppError } from '@/shared/appError';
import { ApiError } from '@/shared/apiError';
import { asyncHandler } from '@/shared/asyncHandler';

type Dependencies = {
  dataFilter: DataFilter;
  authorizer: Authorizer;
  connection: Connection;
};

export function createMembersRouter({
  dataFilter,
  authorizer,
  connection,
}: Dependencies) {
  const listAllMembersRepository = new ListAllMembersSqliteRepository(
    dataFilter,
    connection
  );
  const listAllMembersService = new ListAllMembersService(
    authorizer,
    listAllMembersRepository
  );
  const showMemberDetailRepository = new ShowMemberDetailSqliteRepository(
    dataFilter,
    connection
  );
  const showMemberDetailService = new ShowMemberDetailService(
    authorizer,
    showMemberDetailRepository
  );
  const editMemberDetailRepository = new EditMemberDetailSqliteRepository(
    dataFilter,
    connection
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
