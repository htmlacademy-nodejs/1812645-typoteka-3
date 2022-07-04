'use strict';

const {Router} = require(`express`);

const myCommentsRouter = new Router();

// мои публикации
myCommentsRouter.get(`/`, (req, res) =>
  res.render(`my`)
);

// комментарии к публикациям
myCommentsRouter.get(`/comments`, (req, res) =>
  res.render(`comments`)
);

// категории
myCommentsRouter.get(`/categories`, (req, res) =>
  res.render(`all-categories`)
);

module.exports = myCommentsRouter;
