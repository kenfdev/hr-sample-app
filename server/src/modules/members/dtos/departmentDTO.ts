export class DepartmentDTO {
  constructor(
    public id: string,
    public name: string,
    public managerMemberId: string
  ) {}
}
