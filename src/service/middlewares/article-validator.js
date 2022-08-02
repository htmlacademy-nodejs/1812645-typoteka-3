'use strict';

const {HttpCode} = require(`../const/constants`);
const articleKeys = [`title`, `createDate`, `announce`, `fulltext`, `category`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);

  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request!`);
  }

  res.locals.newArticle = newArticle;
  return next();
};