import { UserMenuItem } from '@/users/shared/userMenuItem';

export const USER_MENU_ITEMS: UserMenuItem[] = [
  new UserMenuItem('admin', true),
  new UserMenuItem('logout', false),
];
