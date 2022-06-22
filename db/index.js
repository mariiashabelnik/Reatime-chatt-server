// load config file from knexfile
const knexConfig = require("./knexfile");
// create a db connection
const db = require("knex")(knexConfig);

//return connection
module.exports = db;
