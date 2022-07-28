'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const articles = require(`../api/articles`);
const search = require(`../api/search`);

const {MOCK_FILE_NAME} = require(`../const/constants`);
const getMockData = require(`../lib/get-mock-data`);

const {
  ArticleService,
  CategoryService,
  SearchService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const data = await getMockData(MOCK_FILE_NAME);
  const mockData = JSON.parse(data);

  categories(app, new CategoryService(mockData));
  articles(app, new ArticleService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
