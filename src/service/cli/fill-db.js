'use strict';

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);

const {
  MAX_COMMENTS,
  DEFAULT_COUNT,
  RANGE_OF_DAYS,
  ExitCode,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_ANNOUNCES_PATH,
  FILE_COMMENTS_PATH,
} = require(`../../constants`);

const {
  getRandomInt,
  getRandomDate,
  shufflingArray,
  readFile,
} = require(`../../utils/utils`);

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  }, {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const logger = getLogger({});

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(getRandomInt(0, items.length - 1), 1)
    );
  }
  return result;
};

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userEmail: users[getRandomInt(0, users.length - 1)].email,
    articleId,
    text: shufflingArray(comments).slice(0, getRandomInt(1, 3)).join(` `),
    data: getRandomDate(RANGE_OF_DAYS),
  }))
);

const generateArticles = (count, titles, categories, userCount, announces, comments) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shufflingArray(announces).slice(0, 1).join(` `),
    fulltext: shufflingArray(announces).slice(1, getRandomInt(1, announces.length - 10)).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    userEmail: users[getRandomInt(0, users.length - 1)].email,
  }))
);

module.exports = {
  name: `--filldb`,
  async run(count) {
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    try {
      logger.info(`Connecting to the database to fill in the tables...`);
      await sequelize.authenticate();
      logger.info(`The connection to the database is established`);
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      return ExitCode.error;
    }

    const titles = await readFile(FILE_TITLES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const announces = await readFile(FILE_ANNOUNCES_PATH);
    const comments = await readFile(FILE_COMMENTS_PATH);

    const articles = generateArticles(countArticles, titles, categories, users.length, announces, comments);

    await initDatabase(sequelize, {categories, articles, users});

    return ExitCode.success;
  }
};
