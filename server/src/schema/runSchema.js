import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try {
  const schema = await readFile(
    new URL("../schema/schema.sql", import.meta.url),
    "utf8"
  );

  await pool.query(schema);
  console.log("Database schema applied successfully!");
} catch (error) {
  console.error("Schema error:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}