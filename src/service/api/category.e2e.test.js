'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`../../constants`);

const categories = require(`./categories`);
const {CategoryService} = require(`../data-service`);
const initDB = require(`../lib/init-db`);

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
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers, roles: mockRoles});
  categories(app, new CategoryService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are "Животные", "Журналы", "Игры"`,
      () => expect(response.body.map((it) => it.name)).toEqual(
          expect.arrayContaining([`Животные`, `Журналы`, `Игры`])
      )
  );
});
