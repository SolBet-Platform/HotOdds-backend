const defaultNodeEnv = 'production';
const defaultAppPort = 8081;
const defaultPostgresPort = 5432;
interface Environment {
  database: {
    url: string;
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    ssl: {
      rejectUnauthorized: boolean;
      ca: string;
    };
  };
  appEnv: string;
  port: number;

  appJwtSecret: string;
}

export const environment: Environment = {
  database: {
    url: process.env.DATABASE_URI || '',
    type: process.env.DATABASE_TYPE || '',
    host: process.env.DATABASE_HOST || '',
    port: Number(process.env.DATABASE_PORT) || defaultPostgresPort,
    username: process.env.DATABASE_USERNAME || '',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || '',
    synchronize:
      (process.env.DATABASE_SYNCHRONIZE as unknown as boolean) || false,
    logging: (process.env.DATABASE_LOGGING as unknown as boolean) || false,
    ssl: {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_SSL_CERT || '',
    },
  },
  appEnv: process.env.NODE_ENV || defaultNodeEnv,
  port: Number(process.env.PORT) || defaultAppPort,
  appJwtSecret: process.env.APP_JWT_SECRET || '',
};
