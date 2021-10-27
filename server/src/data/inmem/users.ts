import { Department } from '@/members/shared/department';
import { Member } from '@/members/shared/member';
import { User } from '@/users/shared/user';

export const USERS: { [key: string]: User } = {
  '1': new User(
    '1',
    'admin',
    new Member('1', 'John', 'Doe', 36, 50000, new Department('1', 'itsec')),
    true
  ),
  '2': new User(
    '2',
    'user001',
    new Member(
      '2',
      'Jane',
      'Doe',
      25,
      50000,
      new Department('2', 'engineering')
    ),
    false
  ),
};
