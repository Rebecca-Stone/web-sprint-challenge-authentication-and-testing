const db = require("../../data/dbConfig");

// function find() {
//   return db("users")
// }

function findBy(filter) {
  return db("users").where(filter);
}

function findById(user_id) {
  return db("users").where("users.user_id", user_id).first();
}

// add
async function add({ username, password }) {
  let created_user_id;
  await db.transaction(async (trx) => {
    const [user_id] = await trx("users").insert({
      username,
      password,
    });
    created_user_id = user_id;
  });
  return findById(created_user_id);
}

module.exports = {
  add,
  findBy,
};
