has_permission(user: User, "read", member: Member) if
  user.member.department.id = member.departmentId or
  user.member.department.name = "hr";

has_permission(user: User, "update", member: Member) if
  user.member.id = member.id or
  user.member.department.name = "hr";
