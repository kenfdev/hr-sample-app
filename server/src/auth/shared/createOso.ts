import { prisma } from '@/app';
import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { User } from '@/users/shared/user';
import { UserMenuItem } from '@/users/shared/userMenuItem';
import { Oso } from 'oso';
import { Filter, Relation } from 'oso/dist/src/dataFiltering';

// FIXME: Since prisma objects are POJOs, we need to create classes
// to pass to Oso by ourselves.
// https://github.com/prisma/prisma/issues/5315
export class DepartmentOrm { }
export class MemberOrm { }
export class UserMenuItemOrm {}

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

  // Since User will always be the LoggedInUser, we use the core entity class
  osoDataFilter.registerClass(User, {
    name: 'User',
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
      departmentId: String,
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
