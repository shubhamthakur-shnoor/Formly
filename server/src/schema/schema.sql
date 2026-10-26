-- Users
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Surveys
CREATE TABLE surveys (
    survey_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL UNIQUE,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED')),
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_at IS NULL OR start_at IS NULL OR end_at > start_at)
);

-- Questions
CREATE TABLE questions (
    question_id BIGSERIAL PRIMARY KEY,
    survey_id BIGINT NOT NULL REFERENCES surveys(survey_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL
        CHECK (question_type IN (
            'MULTIPLE_CHOICE', 'RATING', 'SHORT_ANSWER', 'LONG_ANSWER'
        )),
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    question_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE (survey_id, question_order)
);

-- Question Options
CREATE TABLE question_options (
    option_id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    option_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE (question_id, option_order)
);

-- Responses
CREATE TABLE responses (
    response_id BIGSERIAL PRIMARY KEY,
    survey_id BIGINT NOT NULL REFERENCES surveys(survey_id) ON DELETE CASCADE,
    respondent_name VARCHAR(100),
    respondent_email VARCHAR(255),
    respondent_token TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Answers
CREATE TABLE answers (
    answer_id BIGSERIAL PRIMARY KEY,
    response_id BIGINT NOT NULL REFERENCES responses(response_id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    text_answer TEXT,
    selected_option_id BIGINT REFERENCES question_options(option_id),
    rating_score INTEGER CHECK (rating_score BETWEEN 1 AND 5),
    UNIQUE (response_id, question_id)
);
