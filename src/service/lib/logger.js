'use strict';

const pino = require(`pino`);
const {Env} = require(`../../constants`);

const LOG_FILE = `./logs/api.log`;

const isDevMode = process.env.NODE_ENV === Env.PRODUCTION;
const defaultLogLevel = isDevMode ? `error` : `debug`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: !isDevMode
}, isDevMode ? pino.destination(LOG_FILE) : process.stdout);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
