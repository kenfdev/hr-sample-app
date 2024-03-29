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

  "update" if "self";
  "update" if "hr_member";
}

