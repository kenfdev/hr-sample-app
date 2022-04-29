import { Member } from '@/modules/members/domain/member';

export class User {
  constructor(
    public id: string,
    public username: string,
    public memberInfo: Member,
    public isAdmin: boolean
  ) {}
}
