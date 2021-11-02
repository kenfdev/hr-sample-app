import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Department } from '../department';

@Entity({ name: 'departments' })
export class DepartmentOrm {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  // Usually this wouldn't be simple string id.
  // It should be a many to many relation with member roles
  // for a department but for simplicity, we'll just hold a 
  // manager member id.
  @Column()
  managerMemberId!: string;

  static fromDepartment(department: Department) {
    const d = new DepartmentOrm();
    d.id = department.id;
    d.name = department.name;
    d.managerMemberId = department.managerMemberId;
    return d;
  }

  toDepartment(): Department {
    const d = new Department(this.id, this.name, this.managerMemberId);
    return d;
  }
}
