import { Department } from './department';

export class Member {
  static PUBLIC_FIELDS: string[] = [
    'id',
    'avatar',
    'firstName',
    'lastName',
    'department',
    'joinedAt',
    'phoneNumber',
    'email',
    'pr',
  ];
  static PRIVATE_FIELDS: string[] = ['age', 'salary'];

  constructor(
    public id: string,
    public avatar: string,
    public firstName: string,
    public lastName: string,
    public age: number,
    public salary: number,
    public department: Department,
    public joinedAt: Date,
    public phoneNumber: string,
    public email: string,
    public pr: string
  ) {}

  createObjectWithAuthorizedFields(
    this: any,
    fields: Set<keyof Member>
  ): DisplayableMember {
    const authorizedMember: DisplayableMember = {};

    for (const field of Array.from(fields.values())) {
      authorizedMember[field as keyof DisplayableMember] = this[field];
    }

    return authorizedMember;
  }
}

export type DisplayableMember = {
  id?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  salary?: number;
  department?: Department;
  joinedAt?: Date;
  phoneNumber?: string;
  email?: string;
  pr?: string;
  editable?: boolean;
  isLoggedInUser?: boolean;
};
