require("dotenv/config");
const { defineConfig } = require("drizzle-kit");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.js",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "putcv.com",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123",
    ssl: false,
  },
});
