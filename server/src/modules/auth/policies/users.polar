
resource UserMenuItem {
  permissions = ["read"];
}

has_permission(user: User, "read", menu: UserMenuItem) if
  menu.isAdmin = false or
  (menu.isAdmin and user.isAdmin);
