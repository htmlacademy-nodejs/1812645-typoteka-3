'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const SearchService = require(`../data-service/search-service`);
const {HttpCode} = require(`../../constants`);

const mockUsers = [
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

const mockCategories = [
  `Животные`,
  `Журналы`,
  `Игры`
];

const mockArticles = [
  {
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно`,
    "fulltext": `Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи.`,
    "categories": [
      `Игры`,
    ],
    "comments": [
      {
        "text": `Совсем немного...,`,
        "data": `2022-07-11T18:07:15.256Z`,
      },
      {
        "text": `Хочу такую же футболку :-),`,
        "data": `2022-07-11T18:07:15.256Z`,
      },
    ]
  },
  {
    "title": `Небо каким цветом?`,
    "announce": `О Небе`,
    "fulltext": `Альбом стал настоящим открытием года.`,
    "categories": [
      `Животные`
    ],
    "comments": [
      {
        "text": `Хочу такую же футболку :-).`,
        "data": `2022-07-11T18:07:15.256Z`,
      },
    ],
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  search(app, new SearchService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({query: `Самый лучший музыкальный альбом`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct title`, () => expect(response.body[0].title).toBe(`Самый лучший музыкальный альбом этого года`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app).get(`/search`).query({query: `Another text`}).expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app).get(`/search`).expect(HttpCode.BAD_REQUEST)
);
