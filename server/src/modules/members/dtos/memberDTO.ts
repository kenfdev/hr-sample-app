import { NonFunctionPropertyNames } from '@/shared/sharedTypes';
import { DepartmentDTO } from './departmentDTO';
import {
  Member as PrismaMember,
  Department as PrismaDepartment,
} from '@prisma/client';

export class MemberDTO {
  static PUBLIC_FIELDS: NonFunctionPropertyNames<MemberDTO>[] = [
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
  static PRIVATE_FIELDS: NonFunctionPropertyNames<MemberDTO>[] = ['age', 'salary'];

  constructor(
    public id: string,
    public avatar: string,
    public firstName: string,
    public lastName: string,
    public age: number,
    public salary: number,
    public department: DepartmentDTO,
    public joinedAt: Date,
    public phoneNumber: string,
    public email: string,
    public pr: string
  ) {}

  createObjectWithAuthorizedFields(
    this: any,
    fields: Set<keyof MemberDTO>
  ): Partial<MemberDTO> {
    const authorizedMember: Partial<MemberDTO> = {};

    for (const field of Array.from(fields.values())) {
      authorizedMember[field as keyof Partial<MemberDTO>] = this[field];
    }

    return authorizedMember;
  }

  static createFromOrmModel(
    member: PrismaMember & { department: PrismaDepartment }
  ): MemberDTO {
    return new MemberDTO(
      member.id,
      member.avatar,
      member.firstName,
      member.lastName,
      member.age,
      member.salary,
      new DepartmentDTO(
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
