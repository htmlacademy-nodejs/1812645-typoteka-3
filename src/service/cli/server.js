'use strict';

const sequelize = require(`../lib/sequelize`);
const express = require(`express`);
const chalk = require(`chalk`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const {
  DEFAULT_PORT,
  HttpCode,
  PAGE_NOT_FOUND,
  ExitCode,
  API_PREFIX,
} = require(`../../constants`);

const logger = getLogger({name: `api`});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`* Request on route:${req.url} *Request method:${req.method}`);

  res.on(`finish`, () => {
    logger.info(`Response status code: ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(PAGE_NOT_FOUND);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
  next();
});

module.exports = {
  name: `--server`,
  async run(portNumber) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`The connection to the database is established`);
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      return ExitCode.error;
    }

    const port = Number.parseInt(portNumber, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        logger.error(`Error when creating the server: ${err.message}`);
        return ExitCode.error;
      }

      logger.info(chalk.green(`Waiting for connections on ${port} port`));
    });

    return ExitCode.success;
  }
};
