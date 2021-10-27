import { UserOrm } from '../../users/shared/typeorm/userOrm';
import { define } from 'typeorm-seeding';

define(UserOrm, (faker) => {
  const user = new UserOrm();
  user.id = faker.random.uuid();
  user.isAdmin = faker.random.boolean();
  user.username = faker.name.firstName();
  return user;
});
