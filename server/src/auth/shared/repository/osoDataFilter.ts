import { Oso } from 'oso';
import { DataFilter } from '../dataFilter';

export class OsoDataFilter implements DataFilter {
  constructor(private readonly oso: Oso) {}

  authorizedResources<T = any>(
    actor: any,
    action: any,
    resource: any
  ): Promise<T[]> {
    return this.oso.authorizedResources<T>(actor, action, resource);
  }

  authorizedQuery(actor: any, action: any, resource: any) {
    return this.oso.authorizedQuery(actor, action, resource) as any;
  }
}
