export interface UseCase<Req, Res> {
  execute(request?: Req): Promise<Res> | Res;
}
