import { InvalidOperationError } from '@/shared/core/errors/invalidOperationError';
import { User } from '@/users/shared/user';
import { Oso } from 'oso';
import { AuthorizeRepository } from './authorizeRepository';

export class Authorizer {
  _currentUser?: User;

  constructor(
    private readonly repository: AuthorizeRepository,
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
  ): Promise<Set<keyof R>> {
    return this.authorizedFields(this.currentUser, action, resource);
  }

  async authorizedActionsForUser<R>(resource: R): Promise<Set<string>> {
    return this.authorizedActions(this.currentUser, resource);
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
