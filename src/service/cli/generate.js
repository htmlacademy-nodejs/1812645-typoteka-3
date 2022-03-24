'use strict';

const chalk = require(`chalk`);
const {ExitCode} = require(`../const/constants`);
const {
  RANGE_OF_DAYS,
  MAX_NUMBER_OF_ELEMENTS,
  MOCK_FILE_NAME,
  DEFAULT_COUNT
} = require(`../const/constants`);

const {
  getRandomInt,
  shufflingArray,
  printOffers,
  conversionToString,
  writeFile
} = require(`../utils/utils`);

const {getRandomDate} = require(`../utils/utils`);

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const ANNOUNCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createDate: getRandomDate(RANGE_OF_DAYS),
    announce: shufflingArray(ANNOUNCES).slice(0, 5).join(` `),
    fulltext: shufflingArray(ANNOUNCES).slice(1, getRandomInt(1, ANNOUNCES.length - 1)).join(` `),
    category: CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)],
  }))
);

module.exports = {
  name: `--generate`,
  run(count) {
    if (count > MAX_NUMBER_OF_ELEMENTS) {
      console.log(chalk.red(`\n\tНе больше 1000 публикаций`));
      return ExitCode.error;
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = generateOffers(countOffer);
    printOffers(offers);

    return writeFile(MOCK_FILE_NAME, conversionToString(offers));
  }
};
