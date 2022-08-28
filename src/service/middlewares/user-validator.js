'use strict';

const {HttpCode} = require(`../../constants`);
const schema = require(`../../constants/schemas/user-schema`);
const {ErrorUserMessage} = require(`../../constants/schemas/messages`);

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST).send(ErrorUserMessage.EMAIL_EXIST);
  }

  return next();
};
