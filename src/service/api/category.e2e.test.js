'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../const/constants`);
const categories = require(`./categories`);
const {CategoryService} = require(`../data-service`);

const mockArticles = [
  {
    "id": `GBwa70`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createDate": `2022-05-28T17:43:12.849Z`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно`,
    "fulltext": `Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи.`,
    "category": `Без рамки`,
    "comments": [
      {
        "id": `JbQBwG`,
        "text": `Совсем немного...,`
      },
      {
        "id": `YpFeI_`,
        "text": `Хочу такую же футболку :-),`
      },
      {
        "id": `4wM72Q`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `RxBCZz`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили., Совсем немного...,`
      }
    ]
  },
  {
    "id": `dG1eUU`,
    "comments": [],
    "title": `Небо каким цветом?`,
    "createDate": `2022-05-10T22:09:45.448Z`,
    "announce": `О Небе`,
    "fulltext": `Альбом стал настоящим открытием года.`,
    "category": `Небо`
  }
];

const app = express();
app.use(express.json());
categories(app, new CategoryService(mockArticles));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 categories`, () => expect(response.body.length).toBe(2));

  test(`Category names are "Без рамки", "Небо"`, () => expect(response.body)
    .toEqual(expect.arrayContaining([`Без рамки`, `Небо`]))
  );
});
