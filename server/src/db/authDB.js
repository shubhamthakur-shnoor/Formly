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

export async function getUserPasswordHashById(userId) {
  const { rows } = await pool.query(
    `SELECT password_hash
     FROM users
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
}

export async function updateUserPassword(userId, passwordHash) {
  const { rows } = await pool.query(
    `UPDATE users
     SET password_hash = $2
     WHERE user_id = $1
     RETURNING user_id`,
    [userId, passwordHash]
  );

  return rows[0] || null;
}

export async function updateUserProfile(userId, fullName, email) {
  const { rows } = await pool.query(
    `UPDATE users
     SET full_name = $2,
         email = $3
     WHERE user_id = $1
     RETURNING user_id, full_name, email, created_at`,
    [userId, fullName, email]
  );

  return rows[0] || null;
}