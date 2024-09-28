import { NextFunction, Request, Response } from 'express';
import { environment as env } from '../utils/config/environment';
import { ErrorsConstants } from '../utils/constants/errors';
import AuthorizationError from '../utils/errors/authorizationError';
import InternalServerError from '../utils/errors/internalServerError';
import logger from '../utils/logger';
import { Message } from '../utils/response';
import { prisma } from '../utils/prisma';

export const validUser = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pubk = req.headers['publickey'] as string;
    if (!pubk) {
      res
        .status(ErrorsConstants.access_denied_status)
        .send(new AuthorizationError(Message.PUBLIC_KEY_REQUIRED));
      return;
    }

    const findUser = await prisma.user.findFirst({
      where: { publicKey: pubk },
      select: { publicKey: true },
    });
    if (!findUser) {
      res
        .status(ErrorsConstants.access_denied_status)
        .send(new AuthorizationError(Message.USER_NOT_FOUND));
      return;
    }
    req.id = findUser.publicKey;

    return next();
  } catch (e) {
    logger.error(e);
    res
      .status(ErrorsConstants.internal_error_status)
      .send(new InternalServerError());
  }
};
