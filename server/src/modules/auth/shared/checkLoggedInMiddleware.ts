import { NextFunction, Request, Response } from 'express';
import { Authorizer } from './authorizer';

export function createCheckLoggedInMiddleware(authorizer: Authorizer) {
  return async function checkLoggedInMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // very simple authentication checking middleware. not for production!
    const loggedInUserId = req.headers['x-user-id']?.toString();
    if (!loggedInUserId) {
      return res.status(401).json({ message: 'login required' });
    }
    await authorizer.setUser(loggedInUserId);
    next();
  };
}
