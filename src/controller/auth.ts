import { Request, Response } from 'express';
import logger from '../utils/logger';
import { ErrorsConstants } from '../utils/constants/errors';
import InternalServerError from '../utils/errors/internalServerError';
import SuccessResponse from '../utils/response/successResponse';
import { STANDARD } from '../utils/constants';
import { ApiResponse } from '../utils/types';
import { tokenizer } from '../utils/jwt';
import { auth } from '../repo/auth';
import type { IUser } from '../utils/types/auth.types';

export class AuthController {
  public async createOrFetchUser(
    req: Request,
    res: Response,
  ): Promise<ApiResponse<void>> {
    try {
      //get the address and check if the user already exist.
      //If the user exists return a token,
      //if the user does not exist create user account

      const { address } = req.body;
      let user: IUser;

      user = await auth.findUserByPublicKey(address);
      if (!user) {
        user = await auth.createUser(address);
      }
      const token = tokenizer.sign(user.id);

      const response = new SuccessResponse(
        'Identity fetched',
        STANDARD.SUCCESS,
        { token },
      );
      return res.send(response);
    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());
    }
  }
}
