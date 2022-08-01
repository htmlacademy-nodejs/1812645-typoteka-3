'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search-service`);
const {HttpCode} = require(`../const/constants`);

const mockData = [
  {
    "id": `ZM68eb`,
    "title": `Ёлки. История деревьев`,
    "createDate": `2022-07-18T22:34:09.542Z`,
    "announce": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего.`,
    "fulltext": `Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте.`,
    "category": `Разное`,
    "comments": [
      {
        "id": `RzvBdJ`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили., Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({query: `Ёлки. История деревьев`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(`ZM68eb`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
        .get(`/search`)
        .query({
          query: `Another text`
        })
        .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);
