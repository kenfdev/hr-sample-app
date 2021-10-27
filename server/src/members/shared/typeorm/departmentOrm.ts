import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Department } from '../department';

@Entity({ name: 'departments' })
export class DepartmentOrm {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  static fromDepartment(department: Department) {
    const d = new DepartmentOrm();
    d.id = department.id;
    d.name = department.name;
    return d;
  }

  toDepartment(): Department {
    const d = new Department(this.id, this.name);
    return d;
  }
}
