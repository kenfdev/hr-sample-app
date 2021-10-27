import { Department } from './department';

export class Member {
  static PUBLIC_FIELDS: string[] = [
    'id',
    'firstName',
    'lastName',
    'department',
  ];
  static PRIVATE_FIELDS: string[] = ['age', 'salary'];

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public age: number,
    public salary: number,
    public department: Department
  ) {}

  createObjectWithAuthorizedFields(
    this: any,
    fields: Set<keyof Member>
  ): AuthorizedMember {
    const authorizedMember: AuthorizedMember = {};

    for (const field of Array.from(fields.values())) {
      authorizedMember[field as keyof AuthorizedMember] = this[field];
    }

    return authorizedMember;
  }
}

export type AuthorizedMember = {
  id?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  salary?: number;
  department?: Department;
  editable?: boolean;
};
