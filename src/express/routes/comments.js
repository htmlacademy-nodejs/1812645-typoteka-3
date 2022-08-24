'use strict';

const {Router} = require(`express`);

const myCommentsRouter = new Router();

// мои публикации
myCommentsRouter.get(`/`, (req, res) =>
  res.send(`Мои публикации: /my`)
);

// комментарии к публикациям
myCommentsRouter.get(`/comments`, (req, res) =>
  res.send(`Комментарии к публикациям: /my/comments`)
);

// категории
myCommentsRouter.get(`/categories`, (req, res) =>
  res.send(`Категории: /my/categories`)
);

module.exports = myCommentsRouter;
