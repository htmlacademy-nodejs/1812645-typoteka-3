'use strict';

const Joi = require(`joi`);

const {
  ErrorCommentMessage,
  ErrorUserMessage,
} = require(`../../constants/schemas/messages`);

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .max(250)
    .required()
    .messages({
      'string.min': ErrorCommentMessage.TEXT_MIN,
      'string.max': ErrorCommentMessage.TEXT_MAX,
    }),
  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': ErrorUserMessage.USER_ID,
      'any.required': ErrorCommentMessage.USER_ID_EMPTY,
    }),
});
