import { Department } from '@/modules/members/dtos/departmentDTO';
import { Member } from '@/modules/members/dtos/memberDTO';
import {
  User as PrismaUser,
  Member as PrismaMember,
  Department as PrismaDepartment,
} from '@prisma/client';

export class User {
  constructor(
    public id: string,
    public username: string,
    public memberInfo: Member,
    public isAdmin: boolean
  ) {}

  static createFromOrmModel(
    userRecord: PrismaUser & {
      member: PrismaMember & { department: PrismaDepartment };
    }
  ): User {
    return new User(
      userRecord.id,
      userRecord.username,
      new Member(
        userRecord.member.id,
        userRecord.member.avatar,
        userRecord.member.firstName,
        userRecord.member.lastName,
        userRecord.member.age,
        userRecord.member.salary,
        new Department(
          userRecord.member.department.id,
          userRecord.member.department.name,
          userRecord.member.department.managerMemberId
        ),
        userRecord.member.joinedAt,
        userRecord.member.phoneNumber,
        userRecord.member.email,
        userRecord.member.pr
      ),
      userRecord.isAdmin
    );
  }
}
