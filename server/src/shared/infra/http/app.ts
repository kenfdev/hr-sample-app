import { Authorizer } from '@/auth/shared/authorizer';
import express, { Application } from 'express';
import { createUsersRouter } from '@/users/usersRouter';

import 'reflect-metadata';

import { PrismaClient } from '@prisma/client';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { createContext } from './context';
import { createServer } from '@graphql-yoga/node';
import { createResolvers } from './resolvers';
import { DataFilter } from '@/auth/shared/dataFilter';
import { GetLoggedInUserInfoSqliteRepository } from '@/users/get-logged-in-user-info/repository/getLoggedInUserInfoSqliteRepository';
import { GetLoggedInUserInfoService } from '@/users/get-logged-in-user-info/getLoggedInUserInfoService';
import { ListAllMembersSqliteRepository } from '@/members/list-all-members/repository/listAllMembersSqliteRepository';
import { ListAllMembersService } from '@/members/list-all-members/listAllMembersService';
import { ShowMemberDetailSqliteRepository } from '@/members/show-member-detail/repository/showMemberDetailSqliteRepository';
import { ShowMemberDetailService } from '@/members/show-member-detail/showMemberDetailService';
import { EditMemberDetailSqliteRepository } from '@/members/edit-member-detail/repository/editMemberDetailSqliteRepository';
import { EditMemberDetailService } from '@/members/edit-member-detail/editMemberDetailService';
import { createMembersRouter } from '@/members/membersRouter';
import {
  createCoreOso,
  createSqliteDataFilterOso,
} from '@/auth/shared/createOso';
import { AuthorizeSqliteRepository } from '@/auth/shared/repository/authorizeSqliteRepository';
import { OsoDataFilter } from '@/auth/shared/repository/osoDataFilter';
import { createCheckLoggedInMiddleware } from '@/auth/check-logged-in/checkLoggedInMiddleware';

export const prisma = new PrismaClient();

type UseCaseDependencies = {
  dataFilter: DataFilter;
  authorizer: Authorizer;
  prisma: PrismaClient;
};

const createUseCases = ({
  dataFilter,
  authorizer,
  prisma,
}: UseCaseDependencies) => {
  const getLoggedInUserInfoRepository = new GetLoggedInUserInfoSqliteRepository(
    dataFilter,
    prisma
  );
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

export async function startServer() {
  const oso = await createCoreOso();
  const authorizeRepository = new AuthorizeSqliteRepository(prisma);
  const authorizer = new Authorizer(authorizeRepository, oso);

  const dataFilterOso = await createSqliteDataFilterOso();
  const dataFilter = new OsoDataFilter(dataFilterOso);

  // users
  const usersRouter = createUsersRouter({
    dataFilter,
    authorizer,
    prisma,
  });

  // members
  const membersRouter = createMembersRouter({
    dataFilter,
    authorizer,
    prisma,
  });

  // express
  const app: Application = express();
  app.use(express.json());

  app.use('/users', usersRouter);
  app.use('/members', membersRouter);

  // // Build apollo-server-based graphql endpoint (trial)
  const schema = await loadSchema('schema.graphql', {
    loaders: [new GraphQLFileLoader()],
  });

  const useCases = createUseCases({ dataFilter, authorizer, prisma });
  const resolvers = createResolvers(useCases);
  const graphQLServer = createServer({
    schema: {
      typeDefs: schema,
      resolvers: resolvers,
    },
    context: createContext(),
    plugins: [],
  });

  app.use('/graphql', createCheckLoggedInMiddleware(authorizer));

  app.use('/graphql', graphQLServer.requestListener);

  const port: number = 3031;
  app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
  });
}
