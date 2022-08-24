'use strict';

const {HttpCode} = require(`../../constants`);
const commentKey = [`text`];

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);

  const keysExists = commentKey.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request!`);
  }

  return next();
};
