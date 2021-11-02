import { UserOrm } from '../../users/shared/typeorm/userOrm';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { MemberOrm } from '../../members/shared/typeorm/memberOrm';
import { DEPARTMENT_IDS, USERS } from '../constants';

export default class CreateUsersAndMembers implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const itsecMember = await factory(MemberOrm)().create({
      id: USERS.adminAndItSec.memberId,
      departmentId: DEPARTMENT_IDS.itsec,
    });
    await factory(UserOrm)().create({
      id: USERS.adminAndItSec.userId,
      isAdmin: true,
      memberId: itsecMember.id,
    });

    const hrMember = await factory(MemberOrm)().create({
      id: USERS.nonAdminAndHr.memberId,
      departmentId: DEPARTMENT_IDS.hr,
    });
    await factory(UserOrm)().create({
      id: USERS.nonAdminAndHr.userId,
      isAdmin: false,
      memberId: hrMember.id,
    });

    const engineeringMember = await factory(MemberOrm)().create({
      id: USERS.nonAdminAndEngineer.memberId,
      departmentId: DEPARTMENT_IDS.engineering,
    });
    await factory(UserOrm)().create({
      id: USERS.nonAdminAndEngineer.userId,
      isAdmin: false,
      memberId: engineeringMember.id,
    });

    const engineeringManager = await factory(MemberOrm)().create({
      id: USERS.nonAdminAndEngineerManager.memberId,
      departmentId: DEPARTMENT_IDS.engineering,
    });
    await factory(UserOrm)().create({
      id: USERS.nonAdminAndEngineerManager.userId,
      isAdmin: false,
      memberId: engineeringManager.id,
    });

    const members = await factory(MemberOrm)().createMany(20);
    for (const member of members) {
      await factory(UserOrm)().create({ memberId: member.id });
    }
  }
}
