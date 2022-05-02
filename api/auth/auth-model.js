const db = require("../../data/dbConfig");

function findBy(filter) {
  return db("users").where(filter);
}

function findById(id) {
  // return db("users").where("id", user_id).first();
  return db("users")
    .select("id", "username", "password")
    .where("users.id", id)
    .first();
}

async function add(user) {
  // let created_user_id;
  // await db.transaction(async (trx) => {
  //   const [user_id] = await trx("users").insert({
  //     username,
  //     password,
  //   });
  //   created_user_id = user_id;
  // });
  // return findById(created_user_id);
  const [id] = await db("users").insert(user);
  return findById(id);
}

module.exports = {
  add,
  findBy,
};
