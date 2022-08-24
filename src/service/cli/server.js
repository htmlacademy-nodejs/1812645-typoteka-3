'use strict';

const http = require(`http`);
const chalk = require(`chalk`);
const {readFile} = require(`../utils/utils`);

const {
  MOCK_FILE_NAME,
  ExitCode,
  DEFAULT_PORT,
  HttpCode,
  INTERNAL_SERVER_ERROR,
  PAGE_NOT_FOUND,
} = require(`../const/constants`);

const styles = `
h1 {
  color: red;
  font-size: 24px;
}

p {
  color: green;
  font-size: 16px;
}`;

const sendResponse = (res, statusCode, message) => {
  const template = `
   <!DOCTYPE html>
   <html lang="ru">
    <head>
      <title>From Node with love!</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Анонс предложений!</h1>
      <ul>${message}</ul>
    </body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });
  res.end(template);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/style.css`:
      res.writeHead(HttpCode.OK, {
        'Content-Type': `text/css; charset=UTF-8`,
      });
      res.end(styles);
      break;

    case `/`:
      try {
        const fileContent = await readFile(MOCK_FILE_NAME);
        const mosk = JSON.parse(fileContent);
        const message = mosk.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, message);
      } catch (error) {
        sendResponse(res, HttpCode.INTERNAL_SERVER_ERROR, `${INTERNAL_SERVER_ERROR}`);
      }
      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, `${PAGE_NOT_FOUND}`);
  }
};

module.exports = {
  name: `--server`,
  run(portNumber) {
    const port = Number.parseInt(portNumber, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port, () => {
        console.info(chalk.green(`Сервер создан на ${port} порту`));
      })
      .on(`listening`, () => {
        console.info(chalk.green(`СЕРВЕР: ожидаю соединений на ${port}`));
      })
      .on(`error`, (message) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
        return ExitCode.error;
      })
      .on(`connection`, () => {
        console.log(`Кто-то подключился!`);
      });

    return ExitCode.success;
  }
};
