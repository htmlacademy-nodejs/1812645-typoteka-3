'use strict';

const {HttpCode} = require(`../../constants`);
const schema = require(`../../constants/schemas/article-schema`);

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    const errorMessage = error.details.reduce((acc, item) => ({
      [item.path]: item.message,
      ...acc
    }), {});

    return res.status(HttpCode.BAD_REQUEST).send(errorMessage);
  }

  res.locals.newArticle = newArticle;
  return next();
};
