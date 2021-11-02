import { DepartmentOrm } from '../../members/shared/typeorm/departmentOrm';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { DEPARTMENT_IDS, USERS } from '../constants';
import faker from 'faker';

export default class CreateDepartments implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(DepartmentOrm)
      .values([
        {
          id: DEPARTMENT_IDS.engineering,
          name: 'engineering',
          managerMemberId: USERS.nonAdminAndEngineerManager.memberId,
        },
        {
          id: DEPARTMENT_IDS.itsec,
          name: 'itsec',
          managerMemberId: faker.random.uuid(),
        },
        {
          id: DEPARTMENT_IDS.hr,
          name: 'hr',
          managerMemberId: faker.random.uuid(),
        },
      ])
      .execute();
  }
}
