import { SportController } from 'controller/sport';
import { Router, Application } from 'express';
import { secret } from '../middleware/secret';
import AsyncWrapper from '../utils/asyncWrapper';

export class SportRoute {
  private readonly controller: SportController;
  private readonly router = Router();

  constructor(app: Application, controller: SportController) {
    this.controller = controller;
    app.use('/api/v1/sport', this.router);

    this.initialize();
  }

  private initialize(): void {
    this.router.get(
      '/leagues',
      secret(),
      AsyncWrapper(this.controller.findSportLeagues),
    );

    this.router.get(
      '/events',
      secret(),
      AsyncWrapper(this.controller.fetchBetDexEvents),
    );

    this.router.post(
      '/team-stats',
      secret(),
      AsyncWrapper(this.controller.fetchTeams)
    )

    this.router.get(
      '/h2h',
      secret(),
      AsyncWrapper(this.controller.fetchHeadToHead)
    )

    this.router.post(
      '/fixtures',
      secret(),
      AsyncWrapper(this.controller.fetchFixtures)
    )

    this.router.get(
      '/team-stats/:id',
      secret(),
      AsyncWrapper(this.controller.fetchTeamStats)
    )

    this.router.get(
      '/team-squad/:id',
      secret(),
      AsyncWrapper(this.controller.fetchSquad)
    )

    this.router.get(
      '/player/:id',
      secret(),
      AsyncWrapper(this.controller.fetchPlayer)
    )
  }
}
