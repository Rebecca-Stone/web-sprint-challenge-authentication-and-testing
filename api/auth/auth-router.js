const router = require("express").Router();
const { JWT_SECRET } = require("../secrets/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkNameTaken, checkUserExists } = require("./auth-middleware");
const Users = require("./auth-model");

router.post("/register", checkNameTaken, (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  if (!username || !password) {
    res.status(401).json({ message: "username and password required" });
  } else {
    Users.add({ username, password: hash })
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch(next);
  }
});

router.post("/login", checkUserExists, (req, res, next) => {
  bcrypt.compareSync(req.body.password, req.user.password)
    ? res.status(200).json({
        message: `welcome, ${req.user.username}`,
        token: buildToken(req.user),
      })
    : next({ status: 401, message: "invalid credentials" });
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
