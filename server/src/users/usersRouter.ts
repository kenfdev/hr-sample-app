import express from 'express';
import { Authorizer } from '@/auth/shared/authorizer';
import { createCheckLoggedInMiddleware } from '@/auth/check-logged-in/checkLoggedInMiddleware';
import { UsersController } from './usersController';
import { DataFilter } from '@/auth/shared/dataFilter';
import { GetLoggedInUserInfoSqliteRepository } from './get-logged-in-user-info/repository/getLoggedInUserInfoSqliteRepository';
import { GetLoggedInUserInfoService } from './get-logged-in-user-info/getLoggedInUserInfoService';
import { asyncHandler } from '@/shared/asyncHandler';
import { PrismaClient } from '@prisma/client';

type Dependencies = {
  dataFilter: DataFilter;
  authorizer: Authorizer;
  prisma: PrismaClient;
};

export function createUsersRouter({
  dataFilter,
  authorizer,
  prisma,
}: Dependencies) {
  const getLoggedInUserInfoRepository = new GetLoggedInUserInfoSqliteRepository(
    dataFilter,
    prisma
  );
  const getLoggedInUserInfoService = new GetLoggedInUserInfoService(
    authorizer,
    getLoggedInUserInfoRepository
  );

  const usersController = new UsersController(getLoggedInUserInfoService);
  const router = express.Router();

  router.use(createCheckLoggedInMiddleware(authorizer));

  router.get('/info', asyncHandler(usersController.getLoggedInUserInfo));

  return router;
}
