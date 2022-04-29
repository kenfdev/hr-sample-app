import { Oso } from 'oso';
import { DataFilter } from '../dataFilter';
import { NotAuthorizedError } from '../errors/notAuthorizedError';

export class OsoDataFilter implements DataFilter {
  constructor(private readonly oso: Oso) {}

  authorizedResources<T = any>(
    actor: any,
    action: any,
    resource: any
  ): Promise<T[]> {
    return this.oso.authorizedResources<T>(actor, action, resource);
  }

  async authorizedQuery(actor: any, action: any, resource: any) {
    const query = (await this.oso.authorizedQuery(
      actor,
      action,
      resource
    )) as any;
    if (query === null) {
      throw new NotAuthorizedError(
        `no rules found: actor:${actor}, action:${action}, resource:${resource}`
      );
    }
    return query;
  }
}
