'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  createArticle(article) {
    const newArticle = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._Article.findByPk(id);
  }

  update(id, newArticle) {
    const oldArticle = this._articles.find((item) => item.id === id);

    return Object.assign(oldArticle, newArticle);
  }

  delete(id) {
    const deletedArticle = this._articles.find((item) => item.id === id);
    this._articles = this._articles.filter((item) => item.id !== id);

    return deletedArticle;
  }
}

module.exports = ArticleService;
