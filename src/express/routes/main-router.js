'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

// главная страница
mainRouter.get(`/`, (req, res) => res.send(`Главная страница: /`));

// поиск
mainRouter.get(`/search`, (req, res) => res.send(`Поиск: /search`));

// Регистрация
mainRouter.get(`/register`, (req, res) => res.send(`Регистрация: /entry/register`));

// Логин
mainRouter.get(`/login`, (req, res) => res.send(`Логин: /entry/login`));

module.exports = mainRouter;
