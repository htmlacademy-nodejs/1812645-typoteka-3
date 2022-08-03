'use strict';

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.PUBLIC_DIR = `public`;

module.exports.MOCK_FILE_NAME = `mocks.json`;
module.exports.FILE_TITLES_PATH = `./data/titles.txt`;
module.exports.FILE_CATEGORIES_PATH = `./data/announces.txt`;
module.exports.FILE_ANNOUNCES_PATH = `./data/sentences.txt`;
module.exports.FILE_COMMENTS_PATH = `./data/comments.txt`;

module.exports.API_PREFIX = `/api`;

module.exports.MAX_ID_LENGTH = 6;
module.exports.MAX_COMMENTS = 4;
module.exports.DEFAULT_COUNT = 1;
module.exports.RANGE_OF_DAYS = 90;
module.exports.MAX_NUMBER_OF_ELEMENTS = 1000;
module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;

module.exports.DEFAULT_PORT = 8000;
module.exports.PORT_FOR_FRONT = 8080;

module.exports.PAGE_NOT_FOUND = `Страница не найдена`;
module.exports.INTERNAL_SERVER_ERROR = `Внутренняя ошибка сервера`;

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

