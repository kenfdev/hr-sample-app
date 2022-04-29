import { Result } from './result';

export interface UseCase<Req, Res extends Result<any>> {
  execute(request?: Req): Promise<Res> | Res;
}
