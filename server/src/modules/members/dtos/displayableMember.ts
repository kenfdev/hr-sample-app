import { Member } from '../domain/member';

export type DisplayableMember = Partial<Member> & {
  editable: boolean;
  isLoggedInUser: boolean;
};
