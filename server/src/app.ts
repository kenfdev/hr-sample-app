import { Authorizer } from '@/auth/shared/authorizer';
import express, { Application } from 'express';
import { createUsersRouter } from '@/users/usersRouter';
import { OsoDataFilter } from './auth/shared/repository/osoDataFilter';
import {
  createCoreOso,
  createSqliteDataFilterOso,
} from './auth/shared/createOso';

import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { AuthorizeSqliteRepository } from './auth/shared/repository/authorizeSqliteRepository';
import { createMembersRouter } from './members/membersRouter';

async function start() {
  const connection = await createConnection();

  const oso = await createCoreOso();
  const authorizeRepository = new AuthorizeSqliteRepository(connection);
  const authorizer = new Authorizer(authorizeRepository, oso);

  const dataFilterOso = await createSqliteDataFilterOso(connection);
  const dataFilter = new OsoDataFilter(dataFilterOso);

  // users
  const usersRouter = createUsersRouter({
    dataFilter,
    authorizer,
    connection,
  });

  // members
  const membersRouter = createMembersRouter({
    dataFilter,
    authorizer,
    connection,
  });

  // express
  const app: Application = express();
  app.use(express.json());

  app.use('/users', usersRouter);
  app.use('/members', membersRouter);

  const port: number = 3001;
  app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
  });
}

start();
