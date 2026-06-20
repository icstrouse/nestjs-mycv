import { DataSource, DataSourceOptions } from 'typeorm';

const baseOptions: Partial<DataSourceOptions> = {
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
};

let envOptions: DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    envOptions = {
      ...baseOptions,
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['src/**/*.entity.ts'],
    } as DataSourceOptions;
    break;
  case 'test':
    envOptions = {
      ...baseOptions,
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['src/**/*.entity.ts'],
      migrationsRun: true,
    } as DataSourceOptions;
    break;
  case 'production':
    envOptions = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      }
    }
    break;
  default:
    throw new Error('Unknown environment');
}

export { envOptions };
export default new DataSource(envOptions);
