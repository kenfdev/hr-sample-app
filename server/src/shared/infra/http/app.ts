import express, { Application } from 'express';

import 'reflect-metadata';

import { PrismaClient } from '@prisma/client';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { createContext } from './context';
import { createYoga, createSchema } from 'graphql-yoga';
import { createResolvers, Dependencies } from './resolvers';
import { Authorizer } from '@/modules/auth/shared/authorizer';
import { GetLoggedInUserInfoService } from '@/modules/users/useCases/query/getLoggedInUserInfo/getLoggedInUserInfoService';
import { PrismaMemberRepository } from '@/modules/members/infra/repos/prismaMemberRepository';
import { ListAllMembersService } from '@/modules/members/useCases/query/listAllMembers/listAllMembersService';
import { ShowMemberDetailService } from '@/modules/members/useCases/query/showMemberDetail/showMemberDetailService';
import { EditMemberDetailService } from '@/modules/members/useCases/command/editMemberDetail/editMemberDetailService';
import {
  createCoreOso,
  createSqliteDataFilterOso,
} from '@/modules/auth/shared/createOso';
import { createCheckLoggedInMiddleware } from '@/modules/auth/shared/checkLoggedInMiddleware';

export const prisma = new PrismaClient();

type UseCaseDependencies = {
  authorizer: Authorizer;
  prisma: PrismaClient;
};

const createUseCases = ({ authorizer, prisma }: UseCaseDependencies) => {
  const getLoggedInUserInfoService = new GetLoggedInUserInfoService(
    authorizer,
    prisma
  );

  const prismaMemberRepository = new PrismaMemberRepository(authorizer, prisma);

  const listAllMembersService = new ListAllMembersService(authorizer, prisma);
  const showMemberDetailService = new ShowMemberDetailService(
    authorizer,
    prisma
  );
  const editMemberDetailService = new EditMemberDetailService(
    authorizer,
    prismaMemberRepository
  );

  return {
    getLoggedInUserInfoService,
    listAllMembersService,
    showMemberDetailService,
    editMemberDetailService,
  };
};

export async function startServer() {
  const coreOso = await createCoreOso();
  const dataFilterOso = await createSqliteDataFilterOso();

  const authorizer = new Authorizer(prisma, coreOso, dataFilterOso);

  // express
  const app: Application = express();
  app.use(express.json());

  const useCases = createUseCases({
    authorizer,
    prisma,
  });
  const graphQLServer = await createGraphQLServer(useCases);

  app.use('/graphql', createCheckLoggedInMiddleware(authorizer));

  app.use('/graphql', graphQLServer.requestListener);

  const port: number = 3031;
  app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
  });
}

export async function createGraphQLServer(deps: Dependencies) {
  const schema = await loadSchema('schema.graphql', {
    loaders: [new GraphQLFileLoader()],
  });

  const resolvers = createResolvers(deps);
  const graphQLServer = createYoga({
    schema: createSchema({
      typeDefs: schema,
      resolvers: resolvers,
    }),
    context: createContext(),
    plugins: [],
  });

  return graphQLServer;
}
