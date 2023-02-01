import {
  Member as PrismaMember,
  Department as PrismaDepartment,
  UserMenuItem as PrismaUserMenuItem,
} from '@prisma/client';
import { Oso } from 'oso';
import { Filter, Relation } from 'oso/dist/src/dataFiltering';
import { PrimitivePropertyNames } from '@/shared/sharedTypes';
import { prisma } from '@/shared/infra/http/app';
import { DepartmentDTO } from '@/modules/members/dtos/departmentDTO';
import { MemberDTO } from '@/modules/members/dtos/memberDTO';
import { UserMenuItem } from '@/modules/users/dtos/userMenuItemDTO';
import { UserDTO } from '@/modules/users/dtos/userDTO';

// FIXME: Since prisma objects are POJOs, we need to create classes
// to pass to Oso by ourselves.
// https://github.com/prisma/prisma/issues/5315
export class DepartmentOrm {
  static entityFieldMap: Record<
    PrimitivePropertyNames<DepartmentDTO>,
    PrimitivePropertyNames<PrismaDepartment>
  > = {
    id: 'id',
    name: 'name',
    managerMemberId: 'managerMemberId',
  };

  static buildQuery(constraints: Filter[]) {
    return buildQuery(constraints, DepartmentOrm.entityFieldMap);
  }
}
export class MemberOrm {
  static entityFieldMap: Record<
    PrimitivePropertyNames<MemberDTO>,
    PrimitivePropertyNames<PrismaMember>
  > = {
    id: 'id',
    age: 'age',
    avatar: 'avatar',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    phoneNumber: 'phoneNumber',
    pr: 'pr',
    salary: 'salary',
  };

  static buildQuery(constraints: Filter[]) {
    return buildQuery(constraints, MemberOrm.entityFieldMap);
  }
}

export class UserMenuItemOrm {
  static entityFieldMap: Record<
    PrimitivePropertyNames<UserMenuItem>,
    PrimitivePropertyNames<PrismaUserMenuItem>
  > = {
    name: 'name',
    isAdmin: 'isAdmin',
  };

  static buildQuery(constraints: Filter[]) {
    return buildQuery(constraints, UserMenuItemOrm.entityFieldMap);
  }
}

const buildQuery = (
  constraints: Filter[],
  fieldMap: Record<string, string> = {}
) => {
  const constrain = (query: any, c: Filter) => {
    if (c.field === undefined) {
      c.field = 'id';
      c.value =
        c.kind == 'In'
          ? (c.value as any[]).map((v: any) => v.id)
          : (c.value as any).id; // FIXME: any
    }

    // map entity field names to database field names
    // if no mapping is found, use the field name as is
    const fieldName = (fieldMap[c.field as string] || c.field) as string;

    let q;

    if (c.kind === 'Eq') q = { [fieldName]: c.value };
    else if (c.kind === 'Neq') q = { NOT: { [fieldName]: c.value } };
    else if (c.kind === 'In') query[fieldName] = { in: c.value };
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

const policyFiles = [
  `${__dirname}/../policies/main.polar`,
  `${__dirname}/../policies/users.polar`,
  `${__dirname}/../policies/members.polar`,
];

export async function createSqliteDataFilterOso() {
  const osoDataFilter = new Oso();

  osoDataFilter.setDataFilteringQueryDefaults({
    combineQuery,
  });

  // Since User will always be the LoggedInUser, we use the core entity class
  osoDataFilter.registerClass(UserDTO, {
    name: 'User',
  });
  osoDataFilter.registerClass(UserMenuItemOrm, {
    name: 'UserMenuItem',
    execQuery: execFromModel(prisma.userMenuItem),
    buildQuery: UserMenuItemOrm.buildQuery,
    fields: {
      id: String,
      isAdmin: Boolean,
    },
  });
  osoDataFilter.registerClass(DepartmentOrm, {
    name: 'Department',
    execQuery: execFromModel(prisma.department),
    buildQuery: DepartmentOrm.buildQuery,
    fields: {
      id: String,
      name: String,
      managerMemberId: String,
    },
  });
  osoDataFilter.registerClass(MemberOrm, {
    name: 'Member',
    execQuery: (q) =>
      prisma.member.findMany({
        where: q,
        include: { department: true },
      }),
    buildQuery: MemberOrm.buildQuery,
    fields: {
      id: String,
      departmentId: String,
      department: new Relation('one', 'Department', 'departmentId', 'id'),
    },
  });
  await osoDataFilter.loadFiles(policyFiles);

  return osoDataFilter;
}

export async function createCoreOso() {
  const oso = new Oso();
  oso.registerClass(UserDTO, {
    name: 'User',
  });
  oso.registerClass(UserMenuItem);
  oso.registerClass(DepartmentDTO, {
    name: 'Department',
  });
  oso.registerClass(MemberDTO, {
    name: 'Member',
  });
  await oso.loadFiles(policyFiles);

  return oso;
}
