const { findBy } = require("../auth/auth-model");

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

const checkUserExists = async (req, res, next) => {
  try {
    const [user] = await findBy({ username: req.body.username });
    if (!user) {
      next({ status: 401, message: "invalid credentials" });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { checkNameTaken, checkUserExists };
