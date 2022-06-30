'use strict';

const http = require(`http`);
const chalk = require(`chalk`);

const {
  ExitCode,
  DEFAULT_PORT,
  HTTP_SUCCESS_CODE,
  HTTP_NOT_FOUND_CODE,
} = require(`../const/constants`);

const getResponseText = (userAgent) => (
  `<!DOCTYPE html>
    <html lang="ru">
    <head>
      <title>From Node with love!</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Привет!</h1>
      <p>Ты используешь: ${userAgent}.</p>
    </body>
  </html>`
);

const styles = `
h1 {
  color: red;
  font-size: 24px;
}

p {
  color: green;
  font-size: 16px;
}`;

const onClientConnect = (req, res) => {
  switch (req.url) {
    case `/style.css`:
      res.writeHead(HTTP_SUCCESS_CODE, {
        'Content-Type': `text/css; charset=UTF-8`,
      });
      res.end(styles);
      break;

    case `/`:
      const userAgent = req.headers[`user-agent`];
      const responseText = getResponseText(userAgent);

      res.writeHead(HTTP_SUCCESS_CODE, {
        'Content-Type': `text/html; charset=UTF-8`,
      });
      res.end(responseText);
      break;

    default:
      res.writeHead(HTTP_NOT_FOUND_CODE, {
        'Content-Type': `text/plain; charset=UTF-8`,
      });
      res.end(`Упс, ничего не найдено :(`);
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
