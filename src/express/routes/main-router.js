'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

// главная страница
mainRouter.get(`/`, (req, res) =>
  res.render(`main`)
);

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
