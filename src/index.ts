import App from './app';
import { environment } from './utils/config/environment';
import logger from './utils/logger';

const app = new App().app;

// eslint-disable-next-line
const server = app.listen(environment.port, () =>
  logger.info(`Server running on PORT: ${environment.port}`),
);
export default app;
