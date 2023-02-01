import { DisplayableMember } from '@/modules/members/dtos/displayableMemberDTO';
import { Factory } from 'fishery';
import faker from '@faker-js/faker';

export const displayableMemberFactory = Factory.define<DisplayableMember>(
  () => ({
    id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({ min: 25, max: 60 }),
    salary: faker.datatype.number({ min: 40000, max: 90000 }),
    joinedAt: faker.date.past(),
    phoneNumber: faker.phone.phoneNumber('###-####-####'),
    email: faker.internet.exampleEmail(),
    pr: faker.lorem.sentence(),
    department: {
      id: faker.datatype.uuid(),
      name: faker.name.jobArea(),
      managerMemberId: faker.datatype.uuid(),
    },
    editable: faker.datatype.boolean(),
    isLoggedInUser: faker.datatype.boolean(),
  })
);
