'use strict';

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.MOCK_FILE_NAME = `mocks.json`;
module.exports.FILE_TITLES_PATH = `./data/titles.txt`;
module.exports.FILE_CATEGORIES_PATH = `./data/announces.txt`;
module.exports.FILE_ANNOUNCES_PATH = `./data/sentences.txt`;

module.exports.DEFAULT_COUNT = 1;
module.exports.RANGE_OF_DAYS = 90;
module.exports.MAX_NUMBER_OF_ELEMENTS = 1000;
module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;

module.exports.DEFAULT_PORT = 8000;
module.exports.HTTP_SUCCESS_CODE = 200;
module.exports.HTTP_NOT_FOUND_CODE = 404;
