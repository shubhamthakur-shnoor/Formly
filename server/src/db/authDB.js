import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT user_id, full_name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  return rows[0] || null;
}

export async function createUser(fullName, email, passwordHash) {
  const { rows } = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING user_id, full_name, email, created_at`,
    [fullName, email, passwordHash]
  );

  return rows[0];
}
