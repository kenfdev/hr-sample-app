import { MemberDTO } from './memberDTO';

export type DisplayableMember = Partial<MemberDTO> & {
  editable: boolean;
  isLoggedInUser: boolean;
};
