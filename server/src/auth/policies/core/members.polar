has_permission(user: User, "read", member: Member) if
  user.memberInfo.department.id = member.department.id or
  user.memberInfo.department.name = "hr";

has_permission(user: User, "update", member: Member) if
  user.memberInfo.id = member.id or
  user.memberInfo.department.name = "hr";

allow_field(user: User, "read", member: Member, field) if
  # anyone can read public fields
  field in Member.PUBLIC_FIELDS or
  # private fields are readable only by hr or self
  (field in Member.PRIVATE_FIELDS and 
    (user.memberInfo.department.name = "hr" or user.memberInfo.id = member.id)
  ); # fragile to use department name

allow_field(user: User, "update", member: Member, field) if
  # public fields are updatable if hr or self
  (field in Member.PUBLIC_FIELDS and (user.memberInfo.department.name = "hr" or user.memberInfo.id = member.id)) or
  # private fields like salaries are updatable only by hr
  (field in Member.PRIVATE_FIELDS and user.memberInfo.department.name = "hr");
