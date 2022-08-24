"use strict";

const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const {ArticleService} = require(`../data-service`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `GBwa70`,
    title: `Самый лучший музыкальный альбом этого года`,
    createDate: `2022-05-28T17:43:12.849Z`,
    announce: `Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно`,
    fulltext: `Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи.`,
    category: `Без рамки`,
    comments: [
      {
        id: `JbQBwG`,
        text: `Совсем немного...,`,
      },
      {
        id: `YpFeI_`,
        text: `Хочу такую же футболку :-),`,
      },
      {
        id: `4wM72Q`,
        text: `Планируете записать видосик на эту тему?`,
      },
      {
        id: `RxBCZz`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили., Совсем немного...,`,
      },
    ],
  },
  {
    id: `dG1eUU`,
    title: `Небо каким цветом?`,
    createDate: `2022-05-10T22:09:45.448Z`,
    announce: `О Небе`,
    fulltext: `Альбом стал настоящим открытием года.`,
    category: `Небо`,
    comments: [],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));

  app.use(express.json());
  articles(app, new ArticleService(cloneData));

  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 2 articles`, () =>
    expect(response.body.length).toBe(2));

  test(`First article's id equals "GBwa70"`, () =>
    expect(response.body[0].id).toBe(`GBwa70`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/dG1eUU`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Небо каким цветом"`, () =>
    expect(response.body.title).toBe(`Небо каким цветом?`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Создаем новый пост`,
    createDate: `2022-05-10T22:09:45.448Z`,
    announce: `Производство артиклей на потоке`,
    fulltext: `Создание поста настоящее открытие года.`,
    category: `Движение вверх`,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

describe(`API refuses to create an article if data invalid`, () => {
  const newArticle = {
    title: `Создаем новый пост`,
    createDate: `2022-05-10T22:09:45.448Z`,
    announce: `Производство артиклей на потоке`,
    fulltext: `Создание поста настоящее открытие года.`,
    category: `Движение вверх`,
  };

  const app = createAPI();

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
    title: `Редактируем существующий пост`,
    createDate: `2022-05-10T22:09:45.448Z`,
    announce: `Производство артиклей на потоке`,
    fulltext: `Создание поста настоящее открытие года.`,
    category: `Движение вверх`,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/GBwa70`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article really changed`, () => request(app).get(`/articles/GBwa70`)
      .expect((res) => expect(res.body.title).toBe(`Редактируем существующий пост`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const validArticle = {
    title: `Это`,
    createDate: `2022-05-10T22:09:45.448Z`,
    announce: `валидный`,
    fulltext: `объект`,
    category: `заметки`,
  };

  const app = createAPI();

  return request(app).put(`/articles/Noexst`).send(validArticle)
    .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND));
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const invalidArticle = {
    title: `Это`,
    announce: `не валидный`,
    fulltext: `объект заметки`,
    category: `нет поля createDate`,
  };

  const app = createAPI();

  return request(app).put(`/articles/GBwa70`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an articles`, () => {
  let app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/dG1eUU`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`dG1eUU`));

  test(`Articles count is changed`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/GBwa70/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`, () =>
    expect(response.body.length).toBe(4));

  test(`First comment's id is "JbQBwG"`, () =>
    expect(response.body[0].id).toBe(`JbQBwG`));
});

test(`Status code 404 if article with id is not found`, () => {
  const app = createAPI();

  return request(app).get(`/articles/GBwa7/comments`).expect(HttpCode.NOT_FOUND);
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/GBwa70/comments`).send(newComment);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app).get(`/articles/GBwa70/comments`)
      .expect((res) => expect(res.body.length).toBe(5)));
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app).post(`/articles/NOEXST/comments`).send({text: `Текст неважен`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app).post(`/articles/GBwa70/comments`).send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let response;
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).delete(`/articles/GBwa70/comments/JbQBwG`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`JbQBwG`));

  test(`Comments count is 4 now`, () => request(app).get(`/articles/GBwa70/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/GBwa70/comments/JbQBw`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/GBwa7/comments/JbQBwG`).expect(HttpCode.NOT_FOUND);
});
