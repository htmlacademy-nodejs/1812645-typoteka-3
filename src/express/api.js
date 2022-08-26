'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const {DEFAULT_PORT} = require(`../constants`);
const {HttpMethod} = require(`../constants`);

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

  async editArticles({id, data}) {
    return this._load(`/articles`, {
      method: HttpMethod.PUT,
      data
    });
  }

  async getArticles({offset, limit, withComments} = 0) {
    return this._load(`/articles`, {params: {offset, limit, withComments}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
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
