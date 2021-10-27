import { Member } from '@/members/shared/member';

export class User {
  constructor(
    public id: string,
    public username: string,
    public memberInfo: Member,
    public isAdmin: boolean
  ) {}
}
