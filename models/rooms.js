const db = require("../db");

const insert = (data) => {
  return db("rooms").insert({ room: data.room });
};
const remove = (data) => {
  return db("rooms").where({ room: data.room }).del();
};
const find = () => {
  return db("rooms");
};

const findOne = (room) => {
  return db("rooms").where({ room: room }).first();
};

module.exports = { insert, find, remove, findOne };
