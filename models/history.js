// load db
const db = require("../db");

const insert = (data) => {
  return db("history").insert(data);
};

const removeRoom = (room) => {
  return db("history").where({ room: room }).del();
};
const findByRoom = (room) => {
  return db("history").where({ room: room }).orderBy("created_at", "asc");
};

const findOne = (id) => {
  return db("history").where({ id: id }).first();
};

module.exports = { insert, findByRoom, removeRoom, findOne };
