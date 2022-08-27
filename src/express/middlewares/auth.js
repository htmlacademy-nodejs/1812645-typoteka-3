'use strict';

const {USER_ROLES} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }

  if (user.roleId !== USER_ROLES.ADMIN) {
    return res.redirect(`/login`);
  }

  return next();
};
