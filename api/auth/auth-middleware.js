// const { JWT_SECRET } = require("../secrets");
const { findBy } = require("../auth/auth-model");
// const jwt = require("jsonwebtoken");

const checkNameTaken = async (req, res, next) => {
  try {
    const user = await findBy({ username: req.body.username });
    if (user.length !== 0) {
      next({ status: 401, message: "username taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { checkNameTaken };