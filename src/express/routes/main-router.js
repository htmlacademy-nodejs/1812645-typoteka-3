'use strict';

const {Router} = require(`express`);

const {OFFERS_PER_PAGE} = require(`../../constants`);

const api = require(`../api`).getAPI();

const mainRouter = new Router();

// главная страница
mainRouter.get(`/`, async (req, res) => {
  const limit = OFFERS_PER_PAGE;

  const [articles, categories] = await Promise.all([
    api.getArticles({limit}),
    api.getCategories(true)
  ]);

  res.render(`main`, {articles, categories});
});

// поиск
mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;

  if (!query) {
    res.render(`search`);
    return;
  }

  try {
    const results = await api.search(query);

    res.render(`search-result`, {results, query});
  } catch (error) {
    res.render(`search-result`, {results: []});
  }
});

// Регистрация
mainRouter.get(`/register`, (req, res) =>
  res.render(`sign-up`)
);

// Логин
mainRouter.get(`/login`, (req, res) =>
  res.render(`login`)
);

module.exports = mainRouter;
