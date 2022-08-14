'use strict';

const {
  MAX_COMMENTS,
  DEFAULT_COUNT,
  ExitCode,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_ANNOUNCES_PATH,
  FILE_COMMENTS_PATH,
  FILE_SQL_TABLE_FILL,
} = require(`../../constants`);

const {
  getRandomInt,
  shufflingArray,
  readFile,
  writeFile,
  getPictureFileName,
} = require(`../utils/utils`);

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

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shufflingArray(comments).slice(0, getRandomInt(1, 3)).join(` `),
  }))
);

const generateArticles = (count, titles, categoryCount, userCount, announces, comments) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shufflingArray(announces).slice(0, 1).join(` `),
    fulltext: shufflingArray(announces).slice(1, getRandomInt(1, announces.length - 1)).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    userId: getRandomInt(1, userCount),
  }))
);

module.exports = {
  name: `--fill`,
  async run(count) {
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const titles = await readFile(FILE_TITLES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const announces = await readFile(FILE_ANNOUNCES_PATH);
    const commentSentences = await readFile(FILE_COMMENTS_PATH);

    const articles = generateArticles(countArticles, titles, categories.length, users.length, announces, commentSentences);

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map(
        (article, index) => ({articleId: index + 1, categoryId: article.category[0]})
    );

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, announce, fulltext, picture, userId}) =>
          `('${title}', '${announce}', '${fulltext}', '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) =>
          `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES ${userValues};

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES ${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;

INSERT INTO categories(name) VALUES ${categoryValues};

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES ${articleCategoryValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES ${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;
`;

    try {
      await writeFile(FILE_SQL_TABLE_FILL, content);
      return ExitCode.success;
    } catch (err) {
      return ExitCode.error;
    }
  }
};
