import { define } from 'typeorm-seeding';
import { MemberOrm } from '../../members/shared/typeorm/memberOrm';
import { DEPARTMENT_IDS } from '../constants';

define(MemberOrm, (faker) => {
  const member = new MemberOrm();
  member.id = faker.random.uuid();
  member.firstName = faker.name.firstName();
  member.lastName = faker.name.lastName();
  member.age = faker.random.number({ min: 25, max: 60 });
  member.salary = faker.random.number({ min: 40000, max: 90000 });
  member.departmentId = faker.random.arrayElement([
    DEPARTMENT_IDS.engineering,
    DEPARTMENT_IDS.itsec,
    DEPARTMENT_IDS.hr,
  ]);
  return member;
});
