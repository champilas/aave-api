import { Request, Response, NextFunction } from 'express';
import boom from '@hapi/boom';

export const roleValidator = (...roles : string[]) => {
    return async (req: Request, _: Response, next: NextFunction) => {
        try {
            if (!req.user){
                throw boom.unauthorized("Permission Denied");
            }
            const { role } = req.user as { role: string };

            if (roles.includes(role))
            {
                next();
            }
            else
            {
                next(boom.unauthorized("Permission Denied"));
            }
          } catch (e) {
            next(e);
          }
    }
};
