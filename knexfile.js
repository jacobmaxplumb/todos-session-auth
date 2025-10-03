// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const password = process.env.PG_PASSWORD;
const username = process.env.PG_USER;
const dbName = process.env.PG_DB;
const host = process.env.PG_HOST;
const port = process.env.PG_PORT;

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
    connection: {
      host,
      port,
      database: dbName,
      user: username,
      password: password,
      ssl: { rejectUnauthorized: false }, // Aiven requires SSL
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
