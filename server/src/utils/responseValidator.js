export function validateRespondent(survey, data) {
  if (survey.is_anonymous && !data.respondent_token) {
    return "Submission token is required for anonymous surveys";
  }

  if (!survey.is_anonymous && !data.respondent_email) {
    return "Email is required for this survey";
  }

  return null;
}

function validateSingleAnswer(answer, question) {
  const hasOption = answer.selected_option_id !== undefined;
  const hasRating = answer.rating_score !== undefined;
  const hasText =
    answer.text_answer !== undefined &&
    answer.text_answer.trim() !== "";

  const normalizedAnswer = {
    question_id: question.question_id,
  };

  switch (question.question_type) {
    case "MULTIPLE_CHOICE": {
      if (hasRating || hasText || !hasOption) {
        return { error: "Select one option for this question" };
      }

      const validOption = question.options.some(
        (option) =>
          String(option.option_id) ===
          String(answer.selected_option_id)
      );

      if (!validOption) {
        return { error: "Invalid option for this question" };
      }

      normalizedAnswer.selected_option_id =
        answer.selected_option_id;
      break;
    }

    case "RATING": {
      if (hasOption || hasText || answer.rating_score === undefined) {
        return {
          error: "A rating from 1 to 5 is required for this question",
        };
      }

      normalizedAnswer.rating_score = answer.rating_score;
      break;
    }

    case "SHORT_ANSWER":
    case "LONG_ANSWER": {
      if (hasOption || hasRating || !hasText) {
        return { error: "Text answer is required for this question" };
      }

      normalizedAnswer.text_answer = answer.text_answer.trim();
      break;
    }

    default:
      return { error: "Unsupported question type" };
  }

  return { answer: normalizedAnswer };
}

export function validateAnswers(answers, questions) {
  const questionMap = new Map(
    questions.map((question) => [
      String(question.question_id),
      question,
    ])
  );

  const seenQuestionIds = new Set();
  const answersToSave = [];

  for (const answer of answers) {
    const questionId = String(answer.question_id);
    const question = questionMap.get(questionId);

    if (!question) {
      return {
        error: `Question ${questionId} does not belong to this survey`,
      };
    }

    if (seenQuestionIds.has(questionId)) {
      return {
        error: `Question ${questionId} was answered more than once`,
      };
    }

    const result = validateSingleAnswer(answer, question);

    if (result.error) {
      return {
        error: `Question ${questionId}: ${result.error}`,
      };
    }

    seenQuestionIds.add(questionId);
    answersToSave.push(result.answer);
  }

  const missingQuestion = questions.find(
    (question) =>
      question.is_required &&
      !seenQuestionIds.has(String(question.question_id))
  );

  if (missingQuestion) {
    return {
      error: `Question ${missingQuestion.question_id} is required`,
    };
  }

  return { answers: answersToSave };
}
