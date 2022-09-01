'use strict';

const axios = require(`axios`);

const {
  DEFAULT_PORT,
  HttpMethod,
  TIMEOUT
} = require(`../constants`);

const port = process.env.API_PORT || DEFAULT_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  async getArticles({userId, offset, limit, withComments} = {}) {
    return this._load(`/articles`, {params: {userId, offset, limit, withComments}});
  }

  async getArticlesByCategory({id, offset, limit}) {
    return this._load(`/articles/category/${id}`, {params: {offset, limit}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  async editArticles({id, data}) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteArticle({id, userId}) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
      data: {userId}
    });
  }

  // категории
  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  async editCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteCategory({id, userId}) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE,
      data: {userId}
    });
  }

  // комментарии
  createComment({id, data}) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  getComments() {
    return this._load(`/comments`);
  }

  deleteComments(articleId, commentId) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
    });
  }

  // user
  createUser({data}) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
