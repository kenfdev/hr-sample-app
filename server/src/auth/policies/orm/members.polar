has_role(user: User, "hr_member", _member: Member) if user.memberInfo.department.name = "hr";
has_role(user: User, "self", member: Member) if user.memberInfo.id = member.id;
has_role(user: User, "same_department", member: Member) if user.memberInfo.department.id = member.departmentId;

has_role(user: User, "manager", department: Department) if user.memberInfo.id = department.managerMemberId;

has_relation(department: Department, "department", member: Member) if
  member.department.id = department.id;
