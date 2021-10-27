import { DepartmentOrm } from '../../members/shared/typeorm/departmentOrm';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { DEPARTMENT_IDS } from '../constants';

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
        },
        {
          id: DEPARTMENT_IDS.itsec,
          name: 'itsec',
        },
        {
          id: DEPARTMENT_IDS.hr,
          name: 'hr',
        },
      ])
      .execute();
  }
}
