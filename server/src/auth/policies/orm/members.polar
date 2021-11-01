has_role(user: User, "hr_member", _member: Member) if user.member.department.name = "hr";
has_role(user: User, "self", member: Member) if user.member.id = member.id;
has_role(user: User, "same_department", member: Member) if user.member.department.id = member.department.id;
