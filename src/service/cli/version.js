'use strict';

const chalk = require(`chalk`);
const packageJsonFile = require(`../../../package.json`);
const {ExitCode} = require(`../const/constants`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    console.log(chalk.green(`\n\tВерсия программы: ${version}\n`));

    return ExitCode.success;
  }
};
