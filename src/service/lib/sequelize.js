'use strict';

const {getLogger} = require(`../lib/logger`);
const Sequelize = require(`sequelize`);

const logger = getLogger({name: `api`});

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;
const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((it) => it === undefined);

logger.info(
    `Database parameters.
    Host: ${DB_HOST},
    Port: ${DB_PORT},
    Name of the database: ${DB_NAME},
    User: ${DB_USER},
    Password: ${DB_PASSWORD}`
);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

module.exports = new Sequelize(
    DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    }
);
