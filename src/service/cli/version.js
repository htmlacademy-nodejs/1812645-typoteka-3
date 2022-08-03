'use strict';

const chalk = require(`chalk`);
const packageJsonFile = require(`../../../package.json`);
const {ExitCode} = require(`../../constants`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    console.info(chalk.blue(`\n\tВерсия программы: ${version}\n`));

    return ExitCode.success;
  }
};
