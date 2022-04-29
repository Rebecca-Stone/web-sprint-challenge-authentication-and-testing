const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");
const jwtDecode = require("jwt-decode");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
  await db("users").insert([
    { username: "foo", password: "12345" },
    { username: "bar", password: "12345" },
  ]);
});

afterAll(async () => {
  await db.destroy();
});

// Write your tests here
test("[0] sanity check", () => {
  expect(true).toBe(true);
});

// test 1 & 2

describe("auth-router.js", () => {
  describe("POST /api/auth/register", () => {
    test("[1] - creates a new user", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "baz", password: "12345" });
      const baz = await db("users").where("username", "baz").first();
      expect(baz).toMatchObject({ username: "baz" });
    });

    test("[2] - saves the user with a bcrypted password instead of plain text", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "baz", password: "12345" });
      const baz = await db("users").where("username", "baz").first();
      expect(bcrypt.compareSync("12345", baz.password)).toBeTruthy();
    });
  });

  // test 3 & 4

  describe("POST /api/auth/login", () => {
    test("[3] - responds with the correct message on valid credentials", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "foo", password: "12345" });

      expect(res.body.message).toMatch(/foo is back/i);
    });

    test("[4] - responds with a token", async () => {
      let res = await request(server)
        .post("/api/auth/login")
        .send({ username: "foo", password: "12345" });
      let decoded = jwtDecode(res.body.token);
      expect(decoded).toMatchObject({
        subject: 1,
        username: "foo",
      });
    });
  });
});

// test 5 & 6

describe("jokes-router.js", () => {
  describe("GET /api/jokes", () => {
    test("[5] / - requests without a token can not log in", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.body.message).toMatch(/token required/i);
    });

    test("[6] - requests with a token can view jokes", async () => {
      let res = await request(server)
        .post("/api/auth/login")
        .send({ username: "foo", password: "12345" })
        .get("/api/jokes")
        .set("Authorization", res.body.token);

      expect(res.body).toMatchObject([
        {
          id: "0189hNRf2g",
          joke: "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later.",
        },
        {
          id: "08EQZ8EQukb",
          joke: "Did you hear about the guy whose whole left side was cut off? He's all right now.",
        },
        {
          id: "08xHQCdx5Ed",
          joke: "Why didn’t the skeleton cross the road? Because he had no guts.",
        },
      ]);
    });
  });
});
