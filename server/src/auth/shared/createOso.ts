import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { DepartmentOrm } from '@/members/shared/typeorm/departmentOrm';
import { MemberOrm } from '@/members/shared/typeorm/memberOrm';
import { UserMenuItemOrm } from '@/users/shared/typeorm/userMenuItemOrm';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { UserMenuItem } from '@/users/shared/userMenuItem';
import { Oso } from 'oso';
import { Filter, Relation } from 'oso/dist/src/dataFiltering';
import {
  Connection,
  EntityTarget,
  In,
  IsNull,
  Not,
  ObjectLiteral,
} from 'typeorm';

export async function createSqliteDataFilterOso(connection: Connection) {
  const constrain = (query: ObjectLiteral, filter: Filter) => {
    // console.log(filter);
    switch (filter.kind) {
      case 'Eq':
        query[filter.field as string] = filter.value;
        break;
      case 'Neq':
        query[filter.field as string] = Not(filter.value);
        break;
      case 'In':
        query[filter.field as string] = In(filter.value as any); // FIXME: type?
        break;
      default:
        throw new Error(`Unknown filter kind: ${filter.kind}`);
    }

    return query;
  };

  // Create a query from a list of filters
  const buildQuery = (filters: Filter[]) => {
    // TypeORM dislikes empty queries, so give it this instead.
    if (!filters.length) return { id: Not(IsNull()) };
    return filters.reduce(constrain, {});
  };

  // Combine two queries into one
  const lift = (x: any) => (x instanceof Array ? x : [x]);
  const combineQuery = (a: any, b: any) => lift(a).concat(lift(b));

  // Produce an exec_query function for a class
  const execFromRepo = (repo: EntityTarget<any>) => (q: ObjectLiteral) =>
    connection.getRepository(repo).find({ where: q });

  const osoDataFilter = new Oso();
  osoDataFilter.setDataFilteringQueryDefaults({ combineQuery, buildQuery });

  osoDataFilter.registerClass(UserOrm, {
    name: 'User',
    execQuery: execFromRepo(UserOrm),
    fields: {
      id: String,
      isAdmin: Boolean,
      member: new Relation('one', 'Member', 'memberId', 'id'),
    },
  });
  osoDataFilter.registerClass(UserMenuItemOrm, {
    name: 'UserMenuItem',
    execQuery: execFromRepo(UserMenuItemOrm),
    fields: {
      id: String,
      isAdmin: Boolean,
    },
  });
  osoDataFilter.registerClass(DepartmentOrm, {
    name: 'Department',
    execQuery: execFromRepo(DepartmentOrm),
    fields: {
      id: String,
      name: String,
      managerMemberId: String,
    },
  });
  osoDataFilter.registerClass(MemberOrm, {
    name: 'Member',
    execQuery: execFromRepo(MemberOrm),
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
