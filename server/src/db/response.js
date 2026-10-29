import { pool } from "../config/db.js";
export async function createSurveyResponse(
  surveyId,
  respondentName,
  respondentEmail,
  respondentToken,
  answers
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Save the response and its unique submission token.
    const { rows } = await client.query(
      `INSERT INTO responses (
        survey_id,
        respondent_name,
        respondent_email,
        respondent_token
      )
      VALUES ($1, $2, $3, $4)
      RETURNING response_id, survey_id, submitted_at`,
      [
        surveyId,
        respondentName,
        respondentEmail,
        respondentToken ?? null,
      ]
    );
    const response = rows[0];
    // Save all answers under the newly created response.
    for (const answer of answers) {
      await client.query(
        `INSERT INTO answers (
          response_id,
          question_id,
          text_answer,
          selected_option_id,
          rating_score
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [
          response.response_id,
          answer.question_id,
          answer.text_answer ?? null,
          answer.selected_option_id ?? null,
          answer.rating_score ?? null,
        ]
      );
    }
    await client.query("COMMIT");

    return response;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getSurveyResponseStats(surveyId) {
  // Total responses.
  const totalResult = await pool.query(
    `SELECT COUNT(*) AS total_responses
     FROM responses
     WHERE survey_id = $1`,
    [surveyId]
  );

  // Statistics for each question.
  const questionResult = await pool.query(
    `SELECT
       q.question_id,
       q.question_text,
       q.question_type,
       q.question_order,
       (
         SELECT COUNT(DISTINCT r.response_id)
         FROM answers a
         JOIN responses r
           ON r.response_id = a.response_id
         WHERE a.question_id = q.question_id
           AND r.survey_id = q.survey_id
       ) AS answer_count,
       (
         SELECT ROUND(AVG(a.rating_score)::numeric, 2)
         FROM answers a
         JOIN responses r
           ON r.response_id = a.response_id
         WHERE a.question_id = q.question_id
           AND r.survey_id = q.survey_id
       ) AS average_rating
     FROM questions q
     WHERE q.survey_id = $1
     ORDER BY q.question_order`,
    [surveyId]
  );

  // Multiple-choice option counts.
  const optionResult = await pool.query(
    `SELECT
       o.question_id,
       o.option_id,
       o.option_text,
       (
         SELECT COUNT(DISTINCT r.response_id)
         FROM answers a
         JOIN responses r
           ON r.response_id = a.response_id
         WHERE a.selected_option_id = o.option_id
           AND r.survey_id = q.survey_id
       ) AS selected_count
     FROM question_options o
     JOIN questions q
       ON q.question_id = o.question_id
     WHERE q.survey_id = $1
     ORDER BY q.question_id, o.option_order`,
    [surveyId]
  );

  // Individual text answers.
  const textResult = await pool.query(
    `SELECT
       q.question_id,
       a.text_answer,
       r.submitted_at
     FROM questions q
     JOIN answers a
       ON a.question_id = q.question_id
     JOIN responses r
       ON r.response_id = a.response_id
       AND r.survey_id = q.survey_id
     WHERE q.survey_id = $1
       AND q.question_type IN ('SHORT_ANSWER', 'LONG_ANSWER')
       AND a.text_answer IS NOT NULL
     ORDER BY q.question_order, r.submitted_at DESC`,
    [surveyId]
  );

  // Group options by question.
  const optionsByQuestion = new Map();

  for (const option of optionResult.rows) {
    const questionId = String(option.question_id);

    if (!optionsByQuestion.has(questionId)) {
      optionsByQuestion.set(questionId, []);
    }

    optionsByQuestion.get(questionId).push({
      option_id: option.option_id,
      option_text: option.option_text,
      selected_count: Number(option.selected_count),
    });
  }

  // Group text answers by question.
  const textByQuestion = new Map();

  for (const answer of textResult.rows) {
    const questionId = String(answer.question_id);

    if (!textByQuestion.has(questionId)) {
      textByQuestion.set(questionId, []);
    }

    textByQuestion.get(questionId).push({
      text_answer: answer.text_answer,
      submitted_at: answer.submitted_at,
    });
  }

  // Build final statistics.
  const questions = questionResult.rows.map((question) => ({
    question_id: question.question_id,
    question_text: question.question_text,
    question_type: question.question_type,
    question_order: question.question_order,
    answer_count: Number(question.answer_count),
    average_rating:
      question.average_rating === null
        ? null
        : Number(question.average_rating),
    options:
      optionsByQuestion.get(String(question.question_id)) ?? [],
    text_answers:
      textByQuestion.get(String(question.question_id)) ?? [],
  }));

  return {
    total_responses: Number(totalResult.rows[0].total_responses),
    questions,
  };
}

export async function getSurveyResponsesForExport(surveyId) {
  const { rows } = await pool.query(
    `SELECT
       r.response_id,
       r.respondent_name,
       r.respondent_email,
       q.question_text,
       COALESCE(
         a.text_answer,
         qo.option_text,
         a.rating_score::text,
         ''
       ) AS answer,
       r.submitted_at
     FROM responses r
     LEFT JOIN questions q
       ON q.survey_id = r.survey_id
     LEFT JOIN answers a
       ON a.response_id = r.response_id
       AND a.question_id = q.question_id
     LEFT JOIN question_options qo
       ON qo.option_id = a.selected_option_id
     WHERE r.survey_id = $1
     ORDER BY r.response_id, q.question_order`,
    [surveyId]
  );

  return rows;
}

export async function hasExistingEmailResponse(surveyId, email) {
  const { rows } = await pool.query(
    `SELECT 1
     FROM responses
     WHERE survey_id = $1
       AND LOWER(TRIM(respondent_email)) = LOWER(TRIM($2))
     LIMIT 1`,
    [surveyId, email]
  );

  return rows.length > 0;
}