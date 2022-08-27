'use strict';

const Joi = require(`joi`);
const {ErrorUserMessage} = require(`./messages`);

module.exports = Joi.object({
  firstName: Joi.string()
    .pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/)
    .required()
    .messages({
      'string.empty': ErrorUserMessage.FIRST_NAME_EMPTY,
      'string.pattern.base': ErrorUserMessage.FIRST_NAME_ERR,
      'any.required': ErrorUserMessage.FIRST_NAME_EMPTY,
    }),
  lastName: Joi.string()
    .pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/)
    .required()
    .messages({
      'string.empty': ErrorUserMessage.LAST_NAME_EMPTY,
      'string.pattern.base': ErrorUserMessage.LAST_NAME_ERR,
      'any.required': ErrorUserMessage.LAST_NAME_EMPTY,
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': ErrorUserMessage.EMAIL_ERR,
      'string.empty': ErrorUserMessage.EMAIL_EMPTY,
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': ErrorUserMessage.PASSWORD_ERR,
      'string.empty': ErrorUserMessage.EMAIL_EMPTY,
    }),
  passwordRepeated: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .required()
    .messages({
      'any.only': ErrorUserMessage.PASSWORD_REPEATED_ERR,
      'string.empty': ErrorUserMessage.PASSWORD_EMPTY,
    }),
  avatar: Joi.string()
    .optional()
    .allow(null)
    .messages({
      'string.base': ErrorUserMessage.AVATAR_ERR,
    }),
  roleId: Joi.number()
    .required()
});
