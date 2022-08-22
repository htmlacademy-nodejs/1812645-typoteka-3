'use strict';

const {HttpCode} = require(`../../constants`);
const schema = require(`../../constants/schemas/req-param-schema`);

module.exports = (req, res, next) => {
  const params = req.params;

  const {error} = schema.validate(params);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
