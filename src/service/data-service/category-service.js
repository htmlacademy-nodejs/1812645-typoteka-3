'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      return acc.add(article.category);
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
