'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../const/constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
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
    return this._articles.find((item) => item.id === id);
  }

  update(id, newArticle) {
    const oldArticle = this._articles.find((item) => item.id === id);

    return Object.assign(oldArticle, newArticle);
  }

  delete(id) {
    this._articles = this._articles.filter((item) => item.id !== id);
  }

  deleteComment(article, commentId) {
    for (let i = 0; i < this._articles.length; i++) {
      for (let j = 0; j < this._articles[i].comments.length; j++) {
        if (this._articles[i].comments[j].id === commentId) {
          this._articles[i].comments.splice(j, 1);
        }
      }
    }

    return article;
  }

  createComment(articleId, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);

    this._articles.find((article) => article.id === articleId).comments.push(newComment);

    return newComment;
  }
}

module.exports = ArticleService;
