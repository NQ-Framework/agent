import Knex from 'knex';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';

const dbConnection = {
  client: 'mssql',
  connection: {
    server: DB_HOST,
    options: {
      database: DB_DATABASE,
      port: parseInt(DB_PORT, 10),
      trustServerCertificate: true,
      validateConnection: false,
    },
    authentication: {
      type: 'default',
      options: {
        userName: DB_USER,
        password: DB_PASSWORD,
      },
    },
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default Knex(dbConnection);
