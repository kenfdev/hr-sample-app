import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { DataFilter } from '@/auth/shared/dataFilter';
import { Member } from '@/members/shared/member';
import { MemberOrm } from '@/members/shared/typeorm/memberOrm';
import { AppError, ErrorCodes } from '@/shared/appError';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { ShowMemberDetailRepository } from '../showMemberDetailRepository';

export class ShowMemberDetailSqliteRepository
  implements ShowMemberDetailRepository
{
  private readonly membersRepository: Repository<MemberOrm>;
  constructor(private readonly dataFilter: DataFilter, conn: Connection) {
    this.membersRepository = conn.getRepository(MemberOrm);
  }

  async queryMember(user: User, memberId: string): Promise<Member> {
    const userOrm = UserOrm.fromUser(user);

    const query = await this.dataFilter.authorizedQuery<MemberOrm>(
      userOrm,
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

    const record = await this.membersRepository.findOne(memberId, {
      where: query,
      relations: ['department'],
    });

    if (!record) {
      throw new AppError(
        `member not found ${memberId}`,
        ErrorCodes.MEMBER_NOT_FOUND
      );
    }

    return record.toMember();
  }
}
