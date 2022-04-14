import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from './src/config';

export = {
  client: 'mssql',
  connection: {
    server: DB_HOST,
    options: {
      database: DB_DATABASE,
      port: DB_PORT,
    },
    authentication: {
      type: 'default',
      options: {
        userName: DB_USER,
        password: DB_PASSWORD,
      },
    },
  },
  migrations: {
    directory: 'src/databases/migrations',
    tableName: 'migrations',
    // stub: 'src/databases/stubs',
  },
  seeds: {
    directory: 'src/databases/seeds',
    // stub: 'src/databases/stubs',
  },
};
