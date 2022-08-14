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
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(async () => {
  categories(app, new CategoryService(sequelize));
  articles(app, new ArticleService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
