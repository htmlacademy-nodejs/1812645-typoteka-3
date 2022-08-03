'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();

// главная страница
mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

// поиск
mainRouter.get(`/search`, (req, res) =>
  res.render(`search`)
);

// Регистрация
mainRouter.get(`/register`, (req, res) =>
  res.render(`sign-up`)
);

// Логин
mainRouter.get(`/login`, (req, res) =>
  res.render(`login`)
);

module.exports = mainRouter;
