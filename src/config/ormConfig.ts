import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { config } from 'dotenv';
config();

const host = process.env.TYPEORM_HOST || 'localhost';
// Habilita SSL por padrão se não for localhost (serviços gerenciados como Aiven requerem SSL)
const shouldUseSSL =
  process.env.TYPEORM_SSL === 'true' ||
  (process.env.TYPEORM_SSL !== 'false' &&
    host !== 'localhost' &&
    host !== '127.0.0.1');

const options: DataSourceOptions = {
  type: 'postgres',
  host,
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ['src/modules/**/entities/**.ts'],
  migrations: ['src/database/migrations/*{.js,.ts}'],
  ssl: shouldUseSSL
    ? {
        rejectUnauthorized: false,
      }
    : false,
};

const connectionSource = new DataSource(options);

export default connectionSource;
