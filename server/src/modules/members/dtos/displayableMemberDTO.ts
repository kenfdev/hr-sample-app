import { Member } from './memberDTO';

export type DisplayableMember = Partial<Member> & {
  editable: boolean;
  isLoggedInUser: boolean;
};
