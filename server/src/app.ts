import { Authorizer } from '@/auth/shared/authorizer';
import express, { Application } from 'express';
import { createUsersRouter } from '@/users/usersRouter';
import { OsoDataFilter } from './auth/shared/repository/osoDataFilter';
import {
  createCoreOso,
  createSqliteDataFilterOso,
} from './auth/shared/createOso';

import 'reflect-metadata';

import { AuthorizeSqliteRepository } from './auth/shared/repository/authorizeSqliteRepository';
import { createMembersRouter } from './members/membersRouter';
import { PrismaClient } from '@prisma/client';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { createContext } from './context';
import { createServer } from '@graphql-yoga/node';
import { createCheckLoggedInMiddleware } from './auth/check-logged-in/checkLoggedInMiddleware';
import { resolvers } from './resolvers';

export const prisma = new PrismaClient();

async function start() {
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
  const graphQLServer = createServer({
    schema: {
      typeDefs: schema,
      resolvers: resolvers,
    },
    context: createContext({ dataFilter, authorizer, prisma }),
    plugins: [],
  });

  app.use('/graphql', createCheckLoggedInMiddleware(authorizer));

  app.use('/graphql', graphQLServer.requestListener);

  const port: number = 3031;
  app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
  });
}

start();
