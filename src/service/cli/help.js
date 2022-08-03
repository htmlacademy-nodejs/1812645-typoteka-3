'use strict';

const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Гайд:
      node service.js <command>

      Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate <count>    формирует файл mocks.json
    `;
    console.info(chalk.gray(text));

    return ExitCode.success;
  },
};
