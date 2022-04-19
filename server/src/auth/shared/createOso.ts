import { prisma } from '@/app';
import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { User } from '@/users/shared/user';
import { UserMenuItem } from '@/users/shared/userMenuItem';
import { Oso } from 'oso';
import { Filter, Relation } from 'oso/dist/src/dataFiltering';
import {
  Department as DepartmentModel,
  Member as MemberModel,
  UserMenuItem as UserMenuItemModel,
  User as UserModel,
} from '@prisma/client';

// FIXME: These Orms are extremely verbose
export class DepartmentOrm implements DepartmentModel {
  model = prisma.department;
  id!: string;
  name!: string;
  managerMemberId!: string;
  constructor(data: DepartmentModel) {
    this.id = data.id;
    this.name = data.name;
    this.managerMemberId = data.managerMemberId;
  }
  static fromEntity(department: Department): DepartmentOrm {
    return new DepartmentOrm({
      id: department.id,
      name: department.name,
      managerMemberId: department.managerMemberId,
    });
  }
}
export class MemberOrm implements MemberModel {
  model = prisma.member;
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  joinedAt: Date;
  phoneNumber: string;
  email: string;
  pr: string;
  age: number;
  salary: number;
  departmentId: string;
  department: DepartmentOrm;
  constructor(data: MemberModel & { department: DepartmentModel }) {
    const department = new DepartmentOrm(data.department);
    this.id = data.id;
    this.avatar = data.avatar;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.joinedAt = data.joinedAt;
    this.phoneNumber = data.phoneNumber;
    this.email = data.email;
    this.pr = data.pr;
    this.age = data.age;
    this.salary = data.salary;
    this.departmentId = data.departmentId;
    this.department = department;
  }
  static fromEntity(member: Member): MemberOrm {
    const m = new MemberOrm({
      id: member.id,
      avatar: member.avatar,
      firstName: member.firstName,
      lastName: member.lastName,
      joinedAt: member.joinedAt,
      phoneNumber: member.phoneNumber,
      email: member.email,
      pr: member.pr,
      age: member.age,
      salary: member.salary,
      departmentId: member.department.id,
      department: member.department,
    });
    return m;
  }
}
export class UserMenuItemOrm implements UserMenuItemModel {
  model = prisma.userMenuItem;
  id: string;
  name: string;
  order: number;
  isAdmin: boolean;
  constructor(data: UserMenuItemModel) {
    this.id = data.id;
    this.name = data.name;
    this.order = data.order;
    this.isAdmin = data.isAdmin;
  }
}
export class UserOrm implements UserModel {
  model = prisma.user;
  id: string;
  username: string;
  isAdmin: boolean;
  memberId: string;
  member: MemberOrm;

  constructor(
    data: UserModel & { member: MemberModel & { department: DepartmentModel } }
  ) {
    const member = new MemberOrm(data.member);

    this.id = data.id;
    this.username = data.username;
    this.isAdmin = data.isAdmin;
    this.memberId = data.memberId;
    this.member = member;
  }

  static fromEntity(user: User): UserOrm {
    const member = MemberOrm.fromEntity(user.memberInfo);
    const u = new UserOrm({
      id: user.id,
      isAdmin: user.isAdmin,
      username: user.username,
      memberId: user.memberInfo.id,
      member: member,
    });
    return u;
  }
}

const buildQuery = (constraints: Filter[]) => {
  const constrain = (query: any, c: Filter) => {
    if (c.field === undefined) {
      // console.log(c);
      c.field = 'id';
      c.value =
        c.kind == 'In'
          ? (c.value as any[]).map((v: any) => v.id)
          : (c.value as any).id; // FIXME: any
    }

    let q;

    if (c.kind === 'Eq') q = { [c.field as string]: c.value };
    else if (c.kind === 'Neq') q = { NOT: { [c.field as string]: c.value } };
    else if (c.kind === 'In') query[c.field as string] = { in: c.value };
    else throw new Error(`Unknown constraint kind: ${c.kind}`);

    return { AND: [query, q] };
  };

  if (!constraints.length) return { NOT: { id: '' } };

  const q = constraints.reduce(constrain, {} as any); // FIXME: any
  return q;
};

const combineQuery = (a: any, b: any) => {
  return {
    OR: [a, b],
  };
};

const execFromModel = (model: any) => {
  // FIXME: any
  return (q: any) => model.findMany({ where: q }); // FIXME: any
};

export async function createSqliteDataFilterOso() {
  const osoDataFilter = new Oso();

  osoDataFilter.setDataFilteringQueryDefaults({ combineQuery, buildQuery });

  osoDataFilter.registerClass(UserOrm, {
    name: 'User',
    execQuery: (q) =>
      prisma.user.findMany({
        where: q,
        include: { member: { include: { department: true } } },
      }),
    fields: {
      id: String,
      isAdmin: Boolean,
      member: new Relation('one', 'Member', 'memberId', 'id'),
    },
  });
  osoDataFilter.registerClass(UserMenuItemOrm, {
    name: 'UserMenuItem',
    execQuery: execFromModel(prisma.userMenuItem),
    fields: {
      id: String,
      isAdmin: Boolean,
    },
  });
  osoDataFilter.registerClass(DepartmentOrm, {
    name: 'Department',
    execQuery: execFromModel(prisma.department),
    fields: {
      id: String,
      name: String,
      managerMemberId: String,
    },
  });
  osoDataFilter.registerClass(MemberOrm, {
    name: 'Member',
    execQuery: (q) =>
      prisma.member.findMany({ where: q, include: { department: true } }),
    fields: {
      id: String,
      department: new Relation('one', 'Department', 'departmentId', 'id'),
    },
  });
  await osoDataFilter.loadFiles([
    `${__dirname}/../policies/main.polar`,
    `${__dirname}/../policies/users.polar`,
    `${__dirname}/../policies/members.polar`,
    `${__dirname}/../policies/orm/members.polar`,
  ]);

  return osoDataFilter;
}

export async function createCoreOso() {
  const oso = new Oso();
  oso.registerClass(User);
  oso.registerClass(UserMenuItem);
  oso.registerClass(Department);
  oso.registerClass(Member);
  await oso.loadFiles([
    `${__dirname}/../policies/main.polar`,
    `${__dirname}/../policies/users.polar`,
    `${__dirname}/../policies/members.polar`,
    `${__dirname}/../policies/core/members.polar`,
  ]);

  return oso;
}
