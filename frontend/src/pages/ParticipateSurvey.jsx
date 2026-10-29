import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, LoaderCircle, Send } from "lucide-react";
import api from "../services/api";

export default function ParticipateSurvey() {
  const { slug } = useParams();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchSurvey() {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/public/surveys/${encodeURIComponent(slug)}`
        );

        if (cancelled) return;

        setSurvey(data.survey);
        setQuestions(data.questions || []);
        setAnswers({});
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "We couldn't load this survey. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSurvey();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function updateAnswer(questionId, value) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  const answeredCount = questions.filter((question) => {
    const value = answers[question.question_id];
    return (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    );
  }).length;

  const progress =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!survey) return;

    if (!survey.is_anonymous && (!name.trim() || !email.trim())) {
      setError("Please enter your name and email address.");
      return;
    }
    for (const question of questions) {
      const value = answers[question.question_id];
      if (
        question.is_required &&
        (value === undefined ||
          value === null ||
          String(value).trim() === "")
      ) {
        setError(`Please answer: ${question.question_text}`);
        return;
      }
    }

    const formattedAnswers = questions
      .filter((question) => {
        const value = answers[question.question_id];
        return value !== undefined && value !== null && value !== "";
      })
      .map((question) => {
        const value = answers[question.question_id];
        const answer = { question_id: question.question_id };

        if (question.question_type === "MULTIPLE_CHOICE") {
        answer.selected_option_id = Number(value);
        } else if (question.question_type === "RATING") {
        answer.rating_score = Number(value);
        } else {
        answer.text_answer = value;
        }
        return answer;
      });
    try {
      setSubmitting(true);

      await api.post(
        `/public/surveys/${encodeURIComponent(slug)}/responses`,
        {
          respondent_name: survey.is_anonymous ? null : name.trim(),
          respondent_email: survey.is_anonymous ? null : email.trim(),
          answers: formattedAnswers,
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't submit your response. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f5] px-5">
        <div className="flex flex-col items-center gap-3 text-[#176b4b]">
          <LoaderCircle className="animate-spin" size={32} />
          <p className="text-sm font-medium">Preparing your survey...</p>
        </div>
      </main>
    );
  }

  if (!survey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f5] px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <ClipboardList className="mx-auto mb-4 text-[#176b4b]" size={38} />
          <h1 className="text-xl font-bold text-gray-900">
            Survey unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error || "This survey may no longer be available."}
          </p>
          <Link
            to="/available-surveys"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#176b4b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#10583d]"
          >
            <ArrowLeft size={16} />
            Browse surveys
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f5] px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={34} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
            Thank you for participating!
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your response has been submitted. We appreciate you taking the
            time to share your feedback.
          </p>
          <Link
            to="/available-surveys"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#176b4b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10583d]"
          >
            Explore more surveys
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f5] text-[#17231c]">
      <header className="border-b border-[#e4ebe5] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-[#176b4b]"
          >
            Formly<span className="text-[#34a875]">.</span>
          </Link>

          <Link
            to="/available-surveys"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">All surveys</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-7 sm:px-8 sm:py-12">
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#dce8de] bg-white shadow-sm">
          <div className="h-1.5 bg-[#e8f2e9]">
            <div
              className="h-full bg-[#239466] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f5ed] px-3 py-1.5 text-xs font-semibold text-[#176b4b]">
                <ClipboardList size={14} />
                SURVEY
              </span>

              <span className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500">
                {survey.is_anonymous ? "Anonymous responses" : "Identified responses"}
              </span>
            </div>

            <h1 className="mt-5 break-words text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              {survey.title}
            </h1>

            {survey.description && (
              <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base">
                {survey.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
              <p className="text-sm text-gray-500">
                {questions.length}{" "}
                {questions.length === 1 ? "question" : "questions"}
              </p>
              <p className="text-sm font-medium text-[#176b4b]">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!survey.is_anonymous && (
            <section className="rounded-2xl border border-[#e0e7e1] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#23815a]">
                  About you
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  Your details
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Please enter your details before answering.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="respondent-name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="respondent-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-[#fcfdfc] px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#269467] focus:ring-4 focus:ring-[#269467]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="respondent-email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email address <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="respondent-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-[#fcfdfc] px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#269467] focus:ring-4 focus:ring-[#269467]/10"
                  />
                </div>
              </div>
            </section>
          )}

          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-6 py-14 text-center">
              <ClipboardList
                className="mx-auto mb-3 text-[#39815e]"
                size={32}
              />
              <h2 className="font-semibold text-gray-900">
                No questions yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                The survey creator hasn't added any questions.
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <section
                key={question.question_id}
                className="rounded-2xl border border-[#e0e7e1] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
              >
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f5ed] text-sm font-bold text-[#176b4b]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <h2 className="break-words text-base font-semibold leading-7 text-gray-900 sm:text-lg">
                      {question.question_text}
                      {question.is_required && (
                        <span className="ml-1 text-red-600">*</span>
                      )}
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">
                      {question.is_required ? "Required question" : "Optional question"}
                    </p>
                  </div>
                </div>

                {question.question_type === "MULTIPLE_CHOICE" && (
                  <div className="space-y-3 sm:pl-[52px]">
                    {(question.options || []).map((option) => {
                      const selected =
                        String(answers[question.question_id] ?? "") ===
                        String(option.option_id);

                      return (
                        <label
                          key={option.option_id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                            selected
                              ? "border-[#269467] bg-[#f0f8f2] ring-2 ring-[#269467]/10"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.question_id}`}
                            checked={selected}
                            onChange={() =>
                              updateAnswer(
                                question.question_id,
                                option.option_id
                              )
                            }
                            className="size-4 accent-[#176b4b]"
                          />
                          <span className="break-words text-sm text-gray-700">
                            {option.option_text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {question.question_type === "RATING" && (
                  <div className="sm:pl-[52px]">
                    <div className="flex flex-wrap gap-3">
                      {[1, 2, 3, 4, 5].map((rating) => {
                        const selected =
                          Number(answers[question.question_id]) === rating;

                        return (
                          <button
                            key={rating}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              updateAnswer(question.question_id, rating)
                            }
                            className={`flex size-12 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                              selected
                                ? "border-[#176b4b] bg-[#176b4b] text-white shadow-sm"
                                : "border-gray-200 bg-white text-gray-600 hover:border-[#269467] hover:bg-[#f0f8f2]"
                            }`}
                          >
                            {rating}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex max-w-[288px] justify-between text-xs text-gray-400">
                      <span>Low</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                )}

                {question.question_type === "SHORT_ANSWER" && (
                  <div className="sm:pl-[52px]">
                    <input
                      type="text"
                      value={answers[question.question_id] ?? ""}
                      onChange={(event) =>
                        updateAnswer(question.question_id, event.target.value)
                      }
                      required={question.is_required}
                      placeholder="Type your answer here..."
                      className="w-full rounded-xl border border-gray-200 bg-[#fcfdfc] px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#269467] focus:ring-4 focus:ring-[#269467]/10"
                    />
                  </div>
                )}

                {question.question_type === "LONG_ANSWER" && (
                  <div className="sm:pl-[52px]">
                    <textarea
                      rows={4}
                      value={answers[question.question_id] ?? ""}
                      onChange={(event) =>
                        updateAnswer(question.question_id, event.target.value)
                      }
                      required={question.is_required}
                      placeholder="Share your thoughts..."
                      className="w-full resize-y rounded-xl border border-gray-200 bg-[#fcfdfc] px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-[#269467] focus:ring-4 focus:ring-[#269467]/10"
                    />
                  </div>
                )}
              </section>
            ))
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-[#e0e7e1] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Your progress</span>
              <span className="text-sm font-semibold text-[#176b4b]">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#e8eee9]">
              <div
                className="h-full rounded-full bg-[#269467] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || questions.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176b4b] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10583d] focus:outline-none focus:ring-4 focus:ring-[#269467]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Submitting your response...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit response
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Please review your answers before submitting.
            </p>
          </div>
        </form>

        <footer className="py-8 text-center">
          <p className="text-xs text-gray-400">
            Powered by <span className="font-semibold text-[#176b4b]">Formly</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
