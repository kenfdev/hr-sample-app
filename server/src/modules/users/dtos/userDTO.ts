import { Member } from '@/modules/members/dtos/memberDTO';

export class User {
  constructor(
    public id: string,
    public username: string,
    public memberInfo: Member,
    public isAdmin: boolean
  ) {}
}
