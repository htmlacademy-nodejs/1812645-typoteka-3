'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const getMockData = require(`../lib/get-mock-data`);
const routes = require(`../api`);

const {
  MOCK_FILE_NAME,
  DEFAULT_PORT,
  HttpCode,
  PAGE_NOT_FOUND,
  ExitCode,
  API_PREFIX,
} = require(`../const/constants`);

const app = express();

app.use(express.json());

app.use(API_PREFIX, routes);

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await getMockData(MOCK_FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (error) {
    res.send([]);
  }
});

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(PAGE_NOT_FOUND));

module.exports = {
  name: `--server`,
  run(portNumber) {
    const port = Number.parseInt(portNumber, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
        return ExitCode.error;
      }

      console.info(chalk.green(`Ожидаю соединений на ${port} порт`));
    });

    return ExitCode.success;
  }
};
