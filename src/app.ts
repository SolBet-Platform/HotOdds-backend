import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { BaseAppRoute } from './routes';
import GenericErrorHandler from './utils/errors/genericErrorHandler';
import cors from "cors"

export default class App {
  public app: express.Application;
  private appRoutes: BaseAppRoute = new BaseAppRoute();
  private genericErrorHandler: GenericErrorHandler = new GenericErrorHandler();

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.appRoutes.initialize(this.app);
    this.app.use(this.genericErrorHandler.init);
  }

  private setupMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(morgan('combined'));
    this.app.use(express.json());
    this.app.use(cors({origin:"*"}))
    this.app.use(express.urlencoded({ extended: true })); // might not be necessary
  }
}
