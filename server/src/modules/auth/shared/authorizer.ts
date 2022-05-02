import { User } from '@/modules/users/dtos/userDTO';
import { InvalidOperationError } from '@/shared/core/errors/invalidOperationError';
import { Result } from '@/shared/core/result';
import { PrismaClient } from '@prisma/client';
import { Oso } from 'oso';
import { NotAuthorizedError } from './errors/notAuthorizedError';
import { UserNotFoundError } from './errors/userNotFoundError';

export class Authorizer {
  _currentUser?: User;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly coreOso: Oso,
    private readonly filterOso: Oso
  ) {}

  get currentUser() {
    if (!this._currentUser) {
      throw new InvalidOperationError();
    }
    return this._currentUser;
  }

  async setUser(userId: string): Promise<void> {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        member: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!userRecord) {
      throw new UserNotFoundError(userId);
    }

    const user = User.createFromOrmModel(userRecord);

    this._currentUser = user;
  }

  isAllowed(actor: any, action: any, resource: any): Promise<boolean> {
    return this.coreOso.isAllowed(actor, action, resource);
  }

  async authorizedFieldsForUser<R>(
    action: any,
    resource: R
  ): Promise<Result<Set<keyof R>>> {
    try {
      const fields = await this.authorizedFields(
        this.currentUser,
        action,
        resource
      );

      return Result.ok(fields);
    } catch (err: any) {
      return Result.fail(err);
    }
  }

  async authorizedActionsForUser<R>(resource: R): Promise<Result<Set<string>>> {
    try {
      const actions = await this.authorizedActions(this.currentUser, resource);
      return Result.ok(actions);
    } catch (err: any) {
      return Result.fail(err);
    }
  }

  async authorizedQueryForUser(action: any, resource: any) {
    const query = (await this.filterOso.authorizedQuery(
      this.currentUser,
      action,
      resource
    )) as any;
    if (query === null) {
      throw new NotAuthorizedError(
        `no rules found: actor:${this.currentUser}, action:${action}, resource:${resource}`
      );
    }
    return query;
  }

  private async authorizedFields<R>(actor: any, action: any, resource: R) {
    const set = await this.coreOso.authorizedFields(actor, action, resource);
    return set as Set<keyof R>;
  }

  private async authorizedActions<R>(actor: any, resource: R) {
    const set = await this.coreOso.authorizedActions(actor, resource);
    return set as Set<string>;
  }
}
