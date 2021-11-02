has_role(user: User, "hr_member", _member: Member) if user.member.department.name = "hr";
has_role(user: User, "self", member: Member) if user.member.id = member.id;
has_role(user: User, "same_department", member: Member) if user.member.department.id = member.department.id;

has_role(user: User, "manager", department: Department) if user.member.id = department.managerMemberId;

has_relation(department: Department, "department", member: Member) if
  member.department.id = department.id;

has_permission(user: User, "read", _member: Member) if
  has_role(user, "manager", user.member.department) and
  has_relation(user.member.department, "department", user.member);
