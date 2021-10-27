resource Department {
  permissions = ["read"];
}

has_permission(_: User, "read", _department: Department);

resource Member {
  permissions = ["read", "update"];
  relations = {department: Department};
}

has_relation(department: Department, "department", member: Member) if
  member.department = department;
