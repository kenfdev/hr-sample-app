import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Member } from '../member';
import { DepartmentOrm } from './departmentOrm';

@Entity({ name: 'members' })
export class MemberOrm {
  @PrimaryColumn()
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

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
    m.firstName = member.firstName;
    m.lastName = member.lastName;
    m.age = member.age;
    m.salary = member.salary;
    m.departmentId = member.department.id;
    m.department = DepartmentOrm.fromDepartment(member.department);
    return m;
  }

  toMember() {
    const m = new Member(
      this.id,
      this.firstName,
      this.lastName,
      this.age,
      this.salary,
      this.department.toDepartment()
    );
    return m;
  }
}
