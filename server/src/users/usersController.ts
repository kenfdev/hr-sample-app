import { Request, Response } from 'express';
import { GetLoggedInUserInfoService } from './get-logged-in-user-info/getLoggedInUserInfoService';

export class UsersController {
  constructor(
    private readonly getLoggedInUserInfoService: GetLoggedInUserInfoService
  ) {}

  getLoggedInUserInfo = async (req: Request, res: Response) => {
    const result = await this.getLoggedInUserInfoService.execute();
    res.json(result);
  };
}
