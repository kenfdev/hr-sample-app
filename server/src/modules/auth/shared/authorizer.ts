import { User } from '@/modules/users/domain/user';
import { PrismaUserRepository } from '@/modules/users/infra/repos/prismaUserRepository';
import { InvalidOperationError } from '@/shared/core/errors/invalidOperationError';
import { Result } from '@/shared/core/result';
import { Oso } from 'oso';

export class Authorizer {
  _currentUser?: User;

  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly oso: Oso
  ) {}

  get currentUser() {
    if (!this._currentUser) {
      throw new InvalidOperationError();
    }
    return this._currentUser;
  }

  async setUser(userId: string): Promise<void> {
    const user = await this.repository.getUser(userId);
    this._currentUser = user;
  }

  isAllowed(actor: any, action: any, resource: any): Promise<boolean> {
    return this.oso.isAllowed(actor, action, resource);
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

  private async authorizedFields<R>(actor: any, action: any, resource: R) {
    const set = await this.oso.authorizedFields(actor, action, resource);
    return set as Set<keyof R>;
  }

  private async authorizedActions<R>(actor: any, resource: R) {
    const set = await this.oso.authorizedActions(actor, resource);
    return set as Set<string>;
  }
}
