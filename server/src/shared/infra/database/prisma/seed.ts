import { DEPARTMENT_IDS, USERS } from '../constants';
import { PrismaClient, Prisma, Member, User } from '@prisma/client';
import faker from '@faker-js/faker';
const prisma = new PrismaClient();

const departments: Prisma.DepartmentCreateInput[] = [
  {
    id: DEPARTMENT_IDS.engineering,
    name: 'engineering',
    managerMemberId: USERS.nonAdminAndEngineerManager.memberId,
  },
  {
    id: DEPARTMENT_IDS.itsec,
    name: 'itsec',
    managerMemberId: faker.datatype.uuid(),
  },
  {
    id: DEPARTMENT_IDS.hr,
    name: 'hr',
    managerMemberId: faker.datatype.uuid(),
  },
];

const memberFactory = () => {
  const member = {} as Member;
  member.id = faker.datatype.uuid();
  member.avatar = faker.image.avatar();
  member.firstName = faker.name.firstName();
  member.lastName = faker.name.lastName();
  member.age = faker.datatype.number({ min: 25, max: 60 });
  member.salary = faker.datatype.number({ min: 40000, max: 90000 });
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
};

const userFactory = () => {
  const user = {} as User;
  user.id = faker.datatype.uuid();
  user.isAdmin = faker.datatype.boolean();
  user.username = faker.internet.userName();
  return user;
};

const transfer = async () => {
  for (const d of departments) {
    await prisma.department.create({
      data: d,
    });
  }

  const itsecMember = await prisma.member.create({
    data: {
      ...memberFactory(),
      ...{
        id: USERS.adminAndItSec.memberId,
        departmentId: DEPARTMENT_IDS.itsec,
      },
    },
  });
  await prisma.user.create({
    data: {
      ...userFactory(),
      ...{
        id: USERS.adminAndItSec.userId,
        isAdmin: true,
        memberId: itsecMember.id,
      },
    },
  });

  const hrMember = await prisma.member.create({
    data: {
      ...memberFactory(),
      ...{
        id: USERS.nonAdminAndHr.memberId,
        departmentId: DEPARTMENT_IDS.hr,
      },
    },
  });
  await prisma.user.create({
    data: {
      ...userFactory(),
      ...{
        id: USERS.nonAdminAndHr.userId,
        isAdmin: false,
        memberId: hrMember.id,
      },
    },
  });

  const engineeringMember = await prisma.member.create({
    data: {
      ...memberFactory(),
      ...{
        id: USERS.nonAdminAndEngineer.memberId,
        departmentId: DEPARTMENT_IDS.engineering,
      },
    },
  });
  await prisma.user.create({
    data: {
      ...userFactory(),
      ...{
        id: USERS.nonAdminAndEngineer.userId,
        isAdmin: false,
        memberId: engineeringMember.id,
      },
    },
  });

  const engineeringManager = await prisma.member.create({
    data: {
      ...memberFactory(),
      ...{
        id: USERS.nonAdminAndEngineerManager.memberId,
        departmentId: DEPARTMENT_IDS.engineering,
      },
    },
  });
  await prisma.user.create({
    data: {
      ...userFactory(),
      ...{
        id: USERS.nonAdminAndEngineerManager.userId,
        isAdmin: false,
        memberId: engineeringManager.id,
      },
    },
  });

  for (let index = 0; index < 20; index++) {
    const m = await prisma.member.create({
      data: memberFactory(),
    });
    await prisma.user.create({
      data: {
        ...userFactory(),
        ...{
          memberId: m.id,
        },
      },
    });
  }

  await prisma.userMenuItem.create({
    data: {
      id: '38c60cf7-7fc7-4212-8b1a-c41bcf06744e',
      name: 'Profile',
      order: 10,
      isAdmin: false,
    },
  });
  await prisma.userMenuItem.create({
    data: {
      id: '0bbe907e-f001-4de3-9ece-05fa76f9dfcd',
      name: 'Admin',
      order: 20,
      isAdmin: true,
    },
  });
};

// 定義されたデータを実際のモデルへ登録する処理
const main = async () => {
  console.log(`Start seeding ...`);

  await transfer();

  console.log(`Seeding finished.`);
};

// 処理開始
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
