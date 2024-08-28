import { AuthController } from 'controller/auth';
import { Application, Router } from 'express';
import AsyncWrapper from '../utils/asyncWrapper';
import { secret } from '../middleware/secret';

export class AuthRoute {
  private readonly controller: AuthController;
  private readonly router = Router();

  constructor(app: Application, controller: AuthController) {
    this.controller = controller;
    app.use('/api/v1/auth', this.router);

    this.initialize();
  }

  private initialize(): void {
    this.router.post(
      '/set-identity',
      secret(),
      AsyncWrapper(this.controller.createOrFetchUser),
    );
  }
}
