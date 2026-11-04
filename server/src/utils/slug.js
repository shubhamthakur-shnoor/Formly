import { pool } from "../config/db.js";
export async function generateSlug(title, excludeSurveyId = null) {
  const baseSlug =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "survey";

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { rows } = await pool.query(
      `SELECT survey_id
       FROM surveys
       WHERE slug = $1
         AND ($2::BIGINT IS NULL OR survey_id <> $2)
       LIMIT 1`,
      [slug, excludeSurveyId]
    );

    if (rows.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
