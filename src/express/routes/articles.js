'use strict';

const {Router} = require(`express`);

const articlesRouter = new Router();

// страница публикации
articlesRouter.get(`/:id`, (req, res) =>
  res.send(`Страница публикации: /articles/:id ${req.params.id}`)
);

// редактирование публикации
articlesRouter.patch(`/edit/:id`, (req, res) =>
  res.send(`Редактирование публикации: /articles/edit/:id ${req.params.id}`)
);

// страница создания новой публикации
articlesRouter.post(`/add`, (req, res) =>
  res.send(`Страница создания новой публикации: /articles/add`)
);

// публикации определённой категории
articlesRouter.get(`/category/:id`, (req, res) =>
  res.send(`Публикации определённой категории: /articles/category/:id ${req.params.id}`)
);

module.exports = articlesRouter;
