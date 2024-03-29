"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const articles = require(`./articles`);
const {ArticleService, CommentService} = require(`../data-service`);
const {HttpCode} = require(`../../constants`);

const mockUsers = [
  {
    "email": `ivanov@example.com`,
    "passwordHash": `5f4dcc3b5aa765d61d8327deb882cf99`,
    "firstName": `Иван`,
    "lastName": `Иванов`,
    "avatar": `avatar1.jpg`
  }, {
    "email": `petrov@example.com`,
    "passwordHash": `5f4dcc3b5aa765d61d8327deb882cf99`,
    "firstName": `Пётр`,
    "lastName": `Петров`,
    "avatar": `avatar2.jpg`
  }
];

const mockRoles = [
  `admin`,
  `reader`,
  `guest`,
];

const mockCategories = [
  `Животные`,
  `Журналы`,
  `Игры`
];

const mockArticles = [
  {
    "title": `Лучший музыкальный альбом этого года`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно`,
    "fulltext": `Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи.`,
    "categories": [
      `Игры`
    ],
    "userId": `1`,
    "comments": [
      {
        "data": `2022-07-11T18:07:15.256Z`,
        "text": `Совсем немного...,`,
      },
      {
        "data": `2022-07-11T18:07:15.256Z`,
        "text": `Хочу такую же футболку :-),`,
      },
      {
        "data": `2022-07-11T18:07:15.256Z`,
        "text": `Планируете записать видосик на эту тему?`,
      },
      {
        "data": `2022-07-11T18:07:15.256Z`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили., Совсем немного...,`,
      },
    ],
  },
  {
    "title": `Небо каким цветом?`,
    "announce": `О Небе`,
    "fulltext": `Альбом стал настоящим открытием года.`,
    "categories": [
      `Журналы`
    ],
    "userId": `2`,
    "comments": [
      {
        "text": `Совсем немного осталось сделать`,
        "data": `2022-07-11T18:07:15.256Z`,
      },
    ],
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers, roles: mockRoles});

  const app = express();
  app.use(express.json());
  articles(app, new ArticleService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 2 articles`, () =>
    expect(response.body.length).toBe(2));

  test(`First article's title equals "Лучший музыкальный альбом этого года"`, () =>
    expect(response.body[0].title).toBe(`Лучший музыкальный альбом этого года`));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Небо каким цветом"`, () =>
    expect(response.body.title).toBe(`Небо каким цветом?`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "title": `IT-NEW 1 great profession? Заголовок минимум тридцать символов!!!`,
    "announce": `О Небе. Анонс публикации так-же, должен быть минимум тридцать символов!!!`,
    "fulltext": `Альбом стал настоящим открытием года.`,
    "userId": `2`,
    "categories": [`2`],
    "createdAt": `2022-05-10T22:09:45.448Z`,
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Checking title`, () => expect(response.body.title).toBe(`IT-NEW 1 great profession? Заголовок минимум тридцать символов!!!`));

  test(`Checking for the number of publications`, () => request(app)
    .get(`/articles`).expect((res) => expect(res.body.length).toBe(2))
  );
});

describe(`API refuses to create an article if data invalid`, () => {
  const newArticle = {
    "title": `IT-NEW 1 great profession?`,
    "createDate": `2022-05-10T22:09:45.448Z`,
    "announce": `О Небе`,
    "fulltext": `Альбом стал настоящим открытием года.`,
    "categories": [`2`],
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, categories: `Котики`},
      {...newArticle, title: 1234},
    ];

    for (const badArticle of badArticles) {
      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    "title": `!!! четвертый раз !!! четвертый раз !!! четвертый раз !!! четвертый раз`,
    "announce": `Если разделитель является регулярным выражением, содержащим подгруппы, то каждый раз при сопоставлении с разделителем, результаты (включая те, что не определены) захвата подгруппы будут помещаться внутрь выходного массива.`,
    "fulltext": `объект заметки`,
    "categories": [`3`, `5`, `7`],
    "createdAt": `2022-07-17`,
    "userId": `2`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/2`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app).get(`/articles/2`)
      .expect((res) => expect(res.body.title).toBe(`!!! четвертый раз !!! четвертый раз !!! четвертый раз !!! четвертый раз`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const validArticle = {
    "title": `Это валидный пост, созданный для проверки!!!`,
    "announce": `Если разделитель является регулярным выражением, содержащим подгруппы, то каждый раз при сопоставлении с разделителем, результаты (включая те, что не определены) захвата подгруппы будут помещаться внутрь выходного массива.`,
    "fulltext": `объект заметки`,
    "categories": [`3`, `5`, `7`],
    "createdAt": `2022-07-17`,
    "userId": `2`,
  };

  const app = await createAPI();

  return request(app).put(`/articles/200`).send(validArticle)
    .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND));
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    "title": `Это валидный пост, созданный для проверки!!!`,
    "announce": `Если разделитель является регулярным выражением, содержащим подгруппы, то каждый раз при сопоставлении с разделителем, результаты (включая те, что не определены) захвата подгруппы будут помещаться внутрь выходного массива.`,
    "fulltext": `объект заметки`,
    "categories": [`3`, `5`, `7`],
    "userId": `2`,
  };

  const app = await createAPI();

  return request(app).put(`/articles/2`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body).toBe(true));

  test(`Articles count is changed`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/20`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`, () =>
    expect(response.body.length).toBe(4));

  test(`First comment's text is "Совсем немного...,"`, () =>
    expect(response.body[0].text).toBe(`Совсем немного...,`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этих полей`,
    userId: 1,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/2/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/2/comments`).expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app).post(`/articles/200/comments`).send({
    text: `Валидному комментарию достаточно этих полей`,
    userId: 1,
  })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {
    text: `Не указан userId`
  };

  const app = await createAPI();

  return request(app).post(`/articles/2/comments`).send(invalidComment).expect(HttpCode.BAD_REQUEST);
});

test(`Status code 404 if article with id is not found`, async () => {
  const app = await createAPI();

  return request(app).get(`/articles/20/comments`).expect(HttpCode.NOT_FOUND);
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    "text": `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
    "userId": 1
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/2/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app).get(`/articles/2/comments`)
      .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app).post(`/articles/20/comments`).send({text: `Текст неважен`}).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app).post(`/articles/2/comments`).send({}).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body).toBe(true));

  test(`Comments count is 1 now`, () => request(app).get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/2/comments/20`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/20/comments/1`).expect(HttpCode.NOT_FOUND);
});
