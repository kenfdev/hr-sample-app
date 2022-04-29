export interface DataFilter {
  authorizedResources<T = any>(
    actor: any,
    action: any,
    resource: any
  ): Promise<T[]>;

  authorizedQuery<T = any>(actor: any, action: any, resource: any): Promise<T>;
}
