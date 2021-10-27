import { MemberOrm } from '../../../members/shared/typeorm/memberOrm';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user';

@Entity({ name: 'users' })
export class UserOrm {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column()
  isAdmin!: boolean;

  @Column()
  memberId!: string;

  @OneToOne(() => MemberOrm)
  @JoinColumn()
  member!: MemberOrm;

  static fromUser(user: User) {
    const u = new UserOrm();
    u.id = user.id;
    u.isAdmin = user.isAdmin;
    u.username = user.username;
    u.memberId = user.memberInfo.id;
    u.member = MemberOrm.fromMember(user.memberInfo);
    return u;
  }

  toUser(): User {
    const u = new User(
      this.id,
      this.username,
      this.member.toMember(),
      this.isAdmin
    );

    return u;
  }
}
