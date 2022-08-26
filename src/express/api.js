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
    return this._load(`/articles/add`, {
      method: HttpMethod.POST,
      data
    });
  }

  async getArticles({offset, limit, withComments} = 0) {
    return this._load(`/articles`, {params: {offset, limit, withComments}});
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

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }


  createComment({id, data}) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

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
