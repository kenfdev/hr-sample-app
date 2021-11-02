import { MEMBER_ACTIONS } from '@/auth/shared/constants/actions';
import { DataFilter } from '@/auth/shared/dataFilter';
import { Member } from '@/members/shared/member';
import { MemberOrm } from '@/members/shared/typeorm/memberOrm';
import { AppError, ErrorCodes } from '@/shared/appError';
import { UserOrm } from '@/users/shared/typeorm/userOrm';
import { User } from '@/users/shared/user';
import { Connection, Repository } from 'typeorm';
import {
  EditMemberDetailRepository,
  UpdatePayload,
} from '../editMemberDetailRepository';

export class EditMemberDetailSqliteRepository
  implements EditMemberDetailRepository
{
  private readonly membersRepository: Repository<MemberOrm>;
  constructor(private readonly dataFilter: DataFilter, conn: Connection) {
    this.membersRepository = conn.getRepository(MemberOrm);
  }

  async updateMember(
    user: User,
    memberId: string,
    payload: UpdatePayload
  ): Promise<void> {
    const userOrm = UserOrm.fromUser(user);

    await this.dataFilter.authorizedQuery<MemberOrm>(
      userOrm,
      MEMBER_ACTIONS.READ,
      MemberOrm
    );

    await this.membersRepository.update({ id: memberId }, payload);
  }

  async queryMember(memberId: string): Promise<Member> {
    const record = await this.membersRepository.findOne(memberId, {
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
