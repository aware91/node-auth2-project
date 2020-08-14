const db = require("../database/config");

function getAll() {
  return db("users")
  .select('users.username', 'users.department', 'users.role');
}

function findBy(username) {
  return db("users").where("users.username", username);
}

function getStudents() {
  return db("users")
    .select(
      "users.username as username",
      "users.department as department",
      "users.role as role"
    )
    .where("users.role", "student");
}

function getDepartment(dept) {
  console.log("MODEL ", dept);
  return db("users")
    .select(
      "users.username",
      "users.department as department",
      "users.role as role"
    )
    .where("users.department", dept);
}

function add(user) {
  return db("users").insert(user);
}

module.exports = {
  getAll,
  findBy,
  add,
  getStudents,
  getDepartment,
};