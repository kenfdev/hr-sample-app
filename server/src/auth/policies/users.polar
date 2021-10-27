
resource UserMenuItem {
  permissions = ["read"];
  relations = {member: Member};
}

has_relation(member: Member, "member", user: User) if
  user.member = member;

has_permission(user: User, "read", menu: UserMenuItem) if
  menu.isAdmin = false or
  (menu.isAdmin and user.isAdmin);
