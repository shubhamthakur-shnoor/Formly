import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT user_id, full_name, email, password_hash
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email.trim()]
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
// Find respondent by email
export async function findRespondentByEmail(email) {
  const { rows } = await pool.query(
    `SELECT respondent_id, full_name, email, password_hash, created_at
     FROM respondents
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email.trim()]
  );

  return rows[0] || null;
}

// Create respondent
export async function createRespondent(fullName, email, passwordHash) {
  const { rows } = await pool.query(
    `INSERT INTO respondents (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING respondent_id, full_name, email, created_at`,
    [fullName.trim(), email.trim().toLowerCase(), passwordHash]
  );

  return rows[0];
}

// Find respondent by ID
export async function findRespondentById(respondentId) {
  const { rows } = await pool.query(
    `SELECT respondent_id, full_name, email, created_at
     FROM respondents
     WHERE respondent_id = $1
     LIMIT 1`,
    [respondentId]
  );

  return rows[0] || null;
}
// Find Admin by ID (safe profile data)
export async function findUserById(userId) {
  const { rows } = await pool.query(
    `SELECT user_id, full_name, email, created_at
     FROM users
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
}

// Get Respondent password hash
export async function getRespondentPasswordHashById(respondentId) {
  const { rows } = await pool.query(
    `SELECT password_hash
     FROM respondents
     WHERE respondent_id = $1
     LIMIT 1`,
    [respondentId]
  );

  return rows[0] || null;
}

// Update Respondent password
export async function updateRespondentPassword(respondentId, passwordHash) {
  const { rows } = await pool.query(
    `UPDATE respondents
     SET password_hash = $2,
         updated_at = NOW()
     WHERE respondent_id = $1
     RETURNING respondent_id`,
    [respondentId, passwordHash]
  );

  return rows[0] || null;
}

// Update Respondent profile
export async function updateRespondentProfile(
  respondentId,
  fullName,
  email
) {
  const { rows } = await pool.query(
    `UPDATE respondents
     SET full_name = $2,
         email = $3,
         updated_at = NOW()
     WHERE respondent_id = $1
     RETURNING respondent_id, full_name, email, created_at`,
    [respondentId, fullName, email]
  );

  return rows[0] || null;
}