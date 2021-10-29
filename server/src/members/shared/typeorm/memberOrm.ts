import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Member } from '../member';
import { DepartmentOrm } from './departmentOrm';

@Entity({ name: 'members' })
export class MemberOrm {
  @PrimaryColumn()
  id!: string;

  @Column()
  avatar!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  joinedAt!: Date;

  @Column()
  phoneNumber!: string;

  @Column()
  email!: string;

  @Column()
  pr!: string;

  @Column()
  age!: number;

  @Column()
  salary!: number;

  @Column({ nullable: true })
  departmentId!: string;

  @ManyToOne(() => DepartmentOrm)
  department!: DepartmentOrm;

  static fromMember(member: Member) {
    const m = new MemberOrm();
    m.id = member.id;
    m.avatar = member.avatar;
    m.firstName = member.firstName;
    m.lastName = member.lastName;
    m.joinedAt = member.joinedAt;
    m.phoneNumber = member.phoneNumber;
    m.email = member.email;
    m.pr = member.pr;
    m.age = member.age;
    m.salary = member.salary;
    m.departmentId = member.department.id;
    m.department = DepartmentOrm.fromDepartment(member.department);
    return m;
  }

  toMember() {
    const m = new Member(
      this.id,
      this.avatar,
      this.firstName,
      this.lastName,
      this.age,
      this.salary,
      this.department.toDepartment(),
      this.joinedAt,
      this.phoneNumber,
      this.email,
      this.pr
    );
    return m;
  }
}
