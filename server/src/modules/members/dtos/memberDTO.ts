import { NonFunctionPropertyNames } from '@/shared/sharedTypes';
import { Department } from './departmentDTO';
import {
  Member as PrismaMember,
  Department as PrismaDepartment,
} from '@prisma/client';

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

  static createFromOrmModel(
    member: PrismaMember & { department: PrismaDepartment }
  ): Member {
    return new Member(
      member.id,
      member.avatar,
      member.firstName,
      member.lastName,
      member.age,
      member.salary,
      new Department(
        member.department.id,
        member.department.name,
        member.department.managerMemberId
      ),
      member.joinedAt,
      member.phoneNumber,
      member.email,
      member.pr
    );
  }
}
