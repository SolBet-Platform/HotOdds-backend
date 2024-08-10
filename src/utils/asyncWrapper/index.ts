import { Request, Response, NextFunction } from 'express';
/* eslint-disable */
/**
 * Catch unresolved promise error
 * @param promiseFn
 * @constructor
 * This will no longer be needed when express v5 is released.
 */
export default function AsyncWrapper(promiseFn: any) {
  return (req: Request, res: Response, next: NextFunction) =>
    promiseFn(req, res).catch(next);
}
