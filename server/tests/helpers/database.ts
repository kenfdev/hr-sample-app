import CreateDepartments from '@/database/seeds/create-departments.seed';
import CreateUserMenuItems from '@/database/seeds/create-userMenuItems.seed';
import CreateUsersAndMembers from '@/database/seeds/create-users-members.seed';
import { runSeeder, useRefreshDatabase, useSeeding } from 'typeorm-seeding';

export async function setupDatabase() {
  const connection = await useRefreshDatabase({
    root: `${process.cwd()}/tests/helpers`,
    configName: 'ormconfig.ts',
    connection: 'memory',
  });
  await useSeeding();
  await runSeeder(CreateDepartments);
  await runSeeder(CreateUsersAndMembers);
  await runSeeder(CreateUserMenuItems);

  return connection;
}
