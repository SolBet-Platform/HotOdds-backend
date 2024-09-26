import express from 'express';
import Controller from '../controller';
import NotFoundError from '../utils/errors/notFoundError';
import { Message } from '../utils/response';
import { ErrorsConstants } from '../utils/constants/errors';
import { AuthRoute } from './auth';
import { AuthController } from '../controller/auth';
import { SportRoute } from './sport';
import { SportController } from '../controller/sport';

interface RouteInitializer {
  initialize(appInstance: express.Application): void;
}
export class BaseAppRoute implements RouteInitializer {
  protected readonly controller: Controller = new Controller();
  protected readonly authController: AuthController = new AuthController();
  protected readonly sportController: SportController = new SportController();

  //   private readonly validate = validate;

  initialize(app: express.Application): void {
    app.route('/api/v1').get(this.controller.base);
    app.route('/api/v1/health').get(this.controller.health);

    new AuthRoute(app, this.authController);
    new SportRoute(app, this.sportController);

    app.all('/*', (req, res) => {
      return res
        .status(ErrorsConstants.notFound_status)
        .send(new NotFoundError(Message.INVALID_ROUTE));
    });
  }
}
