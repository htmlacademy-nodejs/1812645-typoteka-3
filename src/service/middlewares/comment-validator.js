'use strict';

const {HttpCode} = require(`../../constants`);
const schema = require(`../../constants/schemas/comment-schema`);

module.exports = (req, res, next) => {
  const newComment = req.body;

  const {error} = schema.validate(newComment, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message));
  }

  return next();
};
