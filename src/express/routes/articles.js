'use strict';

const {Router} = require(`express`);

const articlesRouter = new Router();

// страница создания новой публикации
articlesRouter.get(`/add`, (req, res) =>
  res.render(`post`)
);

// страница публикации
articlesRouter.get(`/:id`, (req, res) =>
  res.render(`post-detail`)
);

// публикации в определённой категории
articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);

// редактирование публикации
articlesRouter.get(`/edit/:id`, (req, res) =>
  res.render(`post`)
);

module.exports = articlesRouter;
