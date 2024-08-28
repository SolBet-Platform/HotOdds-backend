import { NextFunction, Request, Response } from 'express';
import { environment as env } from '../utils/config/environment';
import { ErrorsConstants } from '../utils/constants/errors';
import AuthorizationError from '../utils/errors/authorizationError';
import InternalServerError from '../utils/errors/internalServerError';
import logger from '../utils/logger';
import { Message } from '../utils/response';

export const secret = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const secret = req.headers.secret as string;
      if (env.accessKey !== secret) {
        res
          .status(ErrorsConstants.access_denied_status)
          .send(new AuthorizationError(Message.SECRET_REQUIRED));
      }
      return next();
    } catch (e) {
      logger.error(e);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());
    }
  };
};
