import { NonFunctionPropertyNames } from '@/shared/sharedTypes';
import { Department } from './department';

export class Member {
  static PUBLIC_FIELDS: NonFunctionPropertyNames<Member>[] = [
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
  static PRIVATE_FIELDS: NonFunctionPropertyNames<Member>[] = ['age', 'salary'];

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
  ): Partial<Member> {
    const authorizedMember: Partial<Member> = {};

    for (const field of Array.from(fields.values())) {
      authorizedMember[field as keyof Partial<Member>] = this[field];
    }

    return authorizedMember;
  }
}
