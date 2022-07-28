'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  async findAll(searchText) {
    return this._articles.filter((article) => article.title.includes(searchText));
  }
}

module.exports = SearchService;
