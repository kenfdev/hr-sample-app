import { DepartmentDTO } from '@/modules/members/dtos/departmentDTO';
import { MemberDTO } from '@/modules/members/dtos/memberDTO';
import {
  User as PrismaUser,
  Member as PrismaMember,
  Department as PrismaDepartment,
} from '@prisma/client';

export class UserDTO {
  constructor(
    public id: string,
    public username: string,
    public memberInfo: MemberDTO,
    public isAdmin: boolean
  ) {}

  static createFromOrmModel(
    userRecord: PrismaUser & {
      member: PrismaMember & { department: PrismaDepartment };
    }
  ): UserDTO {
    return new UserDTO(
      userRecord.id,
      userRecord.username,
      new MemberDTO(
        userRecord.member.id,
        userRecord.member.avatar,
        userRecord.member.firstName,
        userRecord.member.lastName,
        userRecord.member.age,
        userRecord.member.salary,
        new DepartmentDTO(
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
