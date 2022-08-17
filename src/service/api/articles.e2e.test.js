"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const articles = require(`./articles`);
const {ArticleService, CommentService} = require(`../data-service`);
const articleValidator = require(`../middlewares/article-validator`);
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
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

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
    "title": `IT-NEW 1 great profession?`,
    "createDate": `2022-05-10T22:09:45.448Z`,
    "announce": `О Небе`,
    "fulltext": `Альбом стал настоящим открытием года.`,
    "userId": `2`,
    "categories": [
      `2`
    ]
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => request(app)
    .get(`/articles`).expect((res) => expect(res.body.length).toBe(3))
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

  // TODO база позволяет создавать запись из невалидных данных
  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      // {...newArticle, categories: `Котики`},
      {...newArticle, title: 1234},
    ];

    for (const badArticle of badArticles) {
      await request(app).post(`/articles`, articleValidator).send(badArticle).expect(HttpCode.CREATED);
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
    "title": `Редактируем существующий пост`,
    "createDate": `2022-05-10T22:09:45.448Z`,
    "announce": `Производство артиклей на потоке`,
    "fulltext": `Создание поста настоящее открытие года.`,
    "categories": [`3`],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/2`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app).get(`/articles/2`)
      .expect((res) => expect(res.body.title).toBe(`Редактируем существующий пост`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const validArticle = {
    "title": `Это`,
    "createDate": `2022-05-10T22:09:45.448Z`,
    "announce": `валидный`,
    "fulltext": `объект`,
    "categories": [`3`],
  };

  const app = await createAPI();

  return request(app).put(`/articles/20`).send(validArticle)
    .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND));
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    "title": `Это`,
    "announce": `не валидный`,
    "fulltext": `объект заметки: нет поля createDate`,
    "categories": [`3`],
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

test(`API refuses to delete non-existent offer`, async () => {
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

test(`Status code 404 if article with id is not found`, async () => {
  const app = await createAPI();

  return request(app).get(`/articles/20/comments`).expect(HttpCode.NOT_FOUND);
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`,
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

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
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
    response = await request(app).delete(`/articles/2/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body).toBe(true));

  test(`Comments count is 1 now`, () => request(app).get(`/articles/2/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
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
