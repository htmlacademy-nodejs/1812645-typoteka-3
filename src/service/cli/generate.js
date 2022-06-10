'use strict';

const chalk = require(`chalk`);
const {
  RANGE_OF_DAYS,
  MAX_NUMBER_OF_ELEMENTS,
  MOCK_FILE_NAME,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_ANNOUNCES_PATH,
  DEFAULT_COUNT,
  ExitCode
} = require(`../const/constants`);

const {
  getRandomInt,
  getRandomDate,
  shufflingArray,
  conversionToString,
  readFile,
  writeFile,
} = require(`../utils/utils`);

const generateOffers = (count, titles, categories, announces) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createDate: getRandomDate(RANGE_OF_DAYS),
    announce: shufflingArray(announces).slice(0, 5).join(` `),
    fulltext: shufflingArray(announces).slice(1, getRandomInt(1, announces.length - 1)).join(` `),
    category: categories[getRandomInt(0, categories.length - 1)],
  }))
);

module.exports = {
  name: `--generate`,
  async run(count) {

    if (count > MAX_NUMBER_OF_ELEMENTS) {
      console.log(chalk.red(`\n\tНе больше 1000 публикаций`));
      return ExitCode.error;
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const fileReadingResults = await Promise.all([
      readFile(FILE_TITLES_PATH),
      readFile(FILE_CATEGORIES_PATH),
      readFile(FILE_ANNOUNCES_PATH)
    ]);

    const fileReadingError = fileReadingResults.find((result) => {
      if (result instanceof Error) {
        return ExitCode.error;
      }
      return ExitCode.success;
    });
    if (fileReadingError) {
      return ExitCode.error;
    }

    const [titles, categories, announces] = fileReadingResults;
    const offers = generateOffers(countOffer, titles, categories, announces);

    return writeFile(MOCK_FILE_NAME, conversionToString(offers));
  }
};
