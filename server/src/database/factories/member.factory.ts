import { define } from 'typeorm-seeding';
import { MemberOrm } from '../../members/shared/typeorm/memberOrm';
import { DEPARTMENT_IDS } from '../constants';

define(MemberOrm, (faker) => {
  const member = new MemberOrm();
  member.id = faker.random.uuid();
  member.avatar = faker.image.avatar();
  member.firstName = faker.name.firstName();
  member.lastName = faker.name.lastName();
  member.age = faker.random.number({ min: 25, max: 60 });
  member.salary = faker.random.number({ min: 40000, max: 90000 });
  member.joinedAt = faker.date.past();
  member.phoneNumber = faker.phone.phoneNumber('###-####-####');
  member.email = faker.internet.exampleEmail();
  member.pr = faker.lorem.sentence();

  member.departmentId = faker.random.arrayElement([
    DEPARTMENT_IDS.engineering,
    DEPARTMENT_IDS.itsec,
    DEPARTMENT_IDS.hr,
  ]);
  return member;
});
