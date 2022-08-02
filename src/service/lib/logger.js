'use strict';

const pino = require(`pino`);

const logger = pino({
  name: `base-logger`,
  level: `info`,
  prettyPrint: true,
  transport: {
    target: `pino-pretty`,
    options: {
      colorize: true
    }
  },
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
