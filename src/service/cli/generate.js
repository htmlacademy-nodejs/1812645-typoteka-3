'use strict';

const chalk = require(`chalk`);
const {
  RANGE_OF_DAYS,
  MAX_NUMBER_OF_ELEMENTS,
  MOCK_FILE_NAME,
  DEFAULT_COUNT,
  ExitCode
} = require(`../const/constants`);

const {
  getRandomInt,
  getRandomDate,
  shufflingArray,
  printOffers,
  conversionToString,
  readFile,
  writeFile,
} = require(`../utils/utils`);

const FILE_TITLES_PATH = `../../../data/titles.txt`;
const FILE_CATEGORIES_PATH = `../../../data/announces.txt`;
const FILE_ANNOUNCES_PATH = `../../../data/sentences.txt`;

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

    const titles = await readFile(FILE_TITLES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const announces = await readFile(FILE_ANNOUNCES_PATH);

    const offers = generateOffers(countOffer, titles, categories, announces);
    printOffers(offers);

    return await writeFile(MOCK_FILE_NAME, conversionToString(offers));
  }
};
