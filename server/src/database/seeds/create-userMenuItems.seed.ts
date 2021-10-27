import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { UserMenuItemOrm } from '../../users/shared/typeorm/userMenuItemOrm';

export default class CreateUserMenuItems implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserMenuItemOrm)
      .values([
        {
          id: '38c60cf7-7fc7-4212-8b1a-c41bcf06744e',
          name: 'profile',
          order: 10,
          isAdmin: false,
        },
        {
          id: '0bbe907e-f001-4de3-9ece-05fa76f9dfcd',
          name: 'admin',
          order: 20,
          isAdmin: true,
        },
        {
          id: '50149a44-0409-4c09-84f4-deca82547659',
          name: 'logout',
          order: 30,
          isAdmin: false,
        },
      ])
      .execute();
  }
}
