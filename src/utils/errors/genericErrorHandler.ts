import { Response, Request, NextFunction } from 'express';
import BaseResponse from '../response/';
import { ErrorsConstants } from '../constants/errors';
import logger from '../logger';
export default class GenericErrorHandler extends BaseResponse {
  // eslint-disable-next-line
  init(err: any, req: Request, res: Response | any, next: NextFunction): void {
    if (err) {
      //Todo refactor this
      logger.error(err);
      res.statusCode = ErrorsConstants.internal_error_status;
      // res.end(res.sentry);
    }
    next();
  }
}
