const { findBy } = require("../auth/auth-model");

const checkNameTaken = async (req, res, next) => {
  try {
    const user = await findBy({ username: req.body.username });
    user.length !== 0
      ? next({ status: 401, message: "username taken" })
      : next();
  } catch (err) {
    next(err);
  }
};

const checkUserExists = async (req, res, next) => {
  try {
    const [user] = await findBy({ username: req.body.username });
    !user
      ? next({ status: 401, message: "invalid credentials" })
      : (req.user = user);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { checkNameTaken, checkUserExists };
