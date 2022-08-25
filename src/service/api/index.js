'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const articles = require(`../api/articles`);
const search = require(`../api/search`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(() => {
  categories(app, new CategoryService(sequelize));
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
