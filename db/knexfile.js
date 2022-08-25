/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

/*const config = {};

config.sqlLite = {
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "db.sqlite3"),
  },
  migrations: {
    tableName: "knex_migrations",
  },
  useNullAsDefault: true,
}; */

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: "knex_migrations",
  },
  useNullAsDefault: true,
};
