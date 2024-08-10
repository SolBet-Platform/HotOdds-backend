import { Request, Response } from 'express';
import SuccessResponse from '../utils/response/successResponse';
import { Message } from '../utils/response';

export default class AppController {
  public base(_: Request, res: Response): void {
    res.send(new SuccessResponse(Message.WELCOME_MESSAGE));
  }
  public health(_: Request, res: Response): void {
    res.send(new SuccessResponse(Message.HEALTH_CHECK_SUCCESS));
  }
}
