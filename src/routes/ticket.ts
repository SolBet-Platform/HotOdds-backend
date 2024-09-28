import { TicketApiController } from 'controller/ticket';
import { Router, Application } from 'express';
import { secret } from '../middleware/secret';
import AsyncWrapper from '../utils/asyncWrapper';
import { validUser } from '../middleware/validuser';

export class TicketRoutes {
  private readonly controller: TicketApiController;
  private readonly router = Router();

  constructor(app: Application, controller: TicketApiController) {
    this.controller = controller;
    app.use('/api/v1/ticket', this.router);

    this.initialize();
  }

  private initialize(): void {
    this.router.post(
      '/create',
      secret(),
      validUser,
      AsyncWrapper(this.controller.createOrFetchUser),
    );

    this.router.get(
      '/fetch-tickets',
      secret(),
      validUser,
      AsyncWrapper(this.controller.fetchAllTickets),
    );

    this.router.get(
      '/fetch-ticket/:ticketId',
      secret(),
      validUser,
      AsyncWrapper(this.controller.FetchTicket),
    );
    this.router.post(
      '/pay-ticket',
      secret(),
      validUser,
      AsyncWrapper(this.controller.ticketPay),
    );
  }
}
