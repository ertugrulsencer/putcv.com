const { drizzle } = require("drizzle-orm/node-postgres");
const schema = require("./schema.js");

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "putcv.com",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123",
  ssl: false,
  max: 5,
});

module.exports = drizzle({ client: pool, schema });
