resource Department {
  permissions = ["read"];
  roles = ["manager"];
}

has_permission(_: User, "read", _department: Department);

resource Member {
  permissions = ["read", "update"];
  roles = ["self", "same_department", "hr_member"];
  relations = {department: Department};

  "read" if "same_department";
  "read" if "hr_member";
  "read" if "self";

  "update" if "self";
  "update" if "hr_member";
}

has_role(user: User, "hr_member", _member: Member) if user.memberInfo.department.name = "hr";
has_role(user: User, "self", member: Member) if user.memberInfo.id = member.id;
has_role(user: User, "same_department", member: Member) if user.memberInfo.department.id = member.department.id;

allow_field(user: User, "read", member: Member, field) if
  # anyone can read public fields
  field in Member.PUBLIC_FIELDS or
  # private fields are readable only by hr or self
  (field in Member.PRIVATE_FIELDS and 
    (has_role(user, "hr_member", member) or has_role(user, "self", member) or has_role(user, "manager", user.memberInfo.department))
  ); # fragile to use department name

allow_field(user: User, "update", member: Member, field) if
  # public fields are updatable if hr or self
  (field in Member.PUBLIC_FIELDS and (has_role(user, "hr_member", member) or has_role(user, "self", member))) or
  # private fields like salaries are updatable only by hr
  (field in Member.PRIVATE_FIELDS and has_role(user, "hr_member", member));

has_role(user: User, "manager", department: Department) if user.memberInfo.id = department.managerMemberId;

has_relation(department: Department, "department", member: Member) if
  member.department.id = department.id;