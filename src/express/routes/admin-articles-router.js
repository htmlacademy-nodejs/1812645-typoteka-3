'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const myCommentsRouter = new Router();

// мои публикации
myCommentsRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`admin-articles`, {articles});
});

// комментарии к публикациям
myCommentsRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});

  res.render(`admin-comments`, {articles: articles.slice(0, 3)});
});

// категории
myCommentsRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();

  res.render(`admin-categories`, {categories});
});

module.exports = myCommentsRouter;
