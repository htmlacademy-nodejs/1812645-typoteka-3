'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const users = require(`../api/users`);
const {UserService} = require(`../data-service`);

const {HttpCode} = require(`../../constants`);

const mockUsers = [
  {
    "email": `ivanov@example.com`,
    "passwordHash": `$2a$10$UDTTsxNRKhlPAXDCR1flK.y/2PQn/ZnoATbVMla13BwaCy8iSI8m6`,
    "firstName": `Иван`,
    "lastName": `Иванов`,
    "avatar": `avatar1.jpg`
  }, {
    "email": `petrov@example.com`,
    "passwordHash": `$2a$10$UDTTsxNRKhlPAXDCR1flK.y/2PQn/ZnoATbVMla13BwaCy8iSI8m6`,
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
  users(app, new UserService(mockDB));

  return app;
};

describe(`API creates user if data is valid`, () => {
  const validUserData = {
    "firstName": `Владимир`,
    "lastName": `Путилин`,
    "email": `punilin@example.com`,
    "password": `123456`,
    "passwordRepeated": `123456`,
    "roleId": `2`,
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(validUserData);
  });

  test(`Status code is 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    "firstName": `Владимир`,
    "lastName": `Путилин`,
    "email": `punilin@example.com`,
    "password": `123456`,
    "passwordRepeated": `123456`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app).post(`/user`).send(badUserData).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1}
    ];

    for (const badUserData of badUsers) {
      await request(app).post(`/user`).send(badUserData).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`}
    ];

    for (const badUserData of badUsers) {
      await request(app).post(`/user`).send(badUserData).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};

    await request(app).post(`/user`).send(badUserData).expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};

    await request(app).post(`/user`).send(badUserData).expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API authenticate user if data is valid`, () => {
  const validAuthData = {
    "email": `ivanov@example.com`,
    "password": `123456`,
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(validAuthData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`User surname is Иванов`, () => expect(response.body.lastName).toBe(`Иванов`));
});

describe(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect status is 401`, async () => {
    const badAuthData = {
      "email": `bademail@example.com`,
      "password": `123456`,
    };

    await request(app).post(`/user/auth`).send(badAuthData).expect(HttpCode.UNAUTHORIZED);
  });

  test(`If password doesn't match status is 401`, async () => {
    const badAuthData = {
      "email": `ivanov@example.com`,
      "password": `bad-password`,
    };

    await request(app).post(`/user/auth`).send(badAuthData).expect(HttpCode.UNAUTHORIZED);
  });
});
