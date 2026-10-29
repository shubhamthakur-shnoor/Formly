import { useEffect, useState } from "react";
import { Users, RefreshCw, BarChart3, MessageSquareText, Star } from "lucide-react";
import api from "../../services/api";
import { EmptyState } from "./DashboardUI";
const getSurveyId = (survey) => survey.id ?? survey.survey_id;
const getSurveyTitle = (survey) =>
  survey.title || survey.name || "Untitled survey";
const getQuestionType = (question) =>
  (question.question_type || "Question").replace(/_/g, " ");

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#bbcabf] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#53645a]">{title}</p>
        <span className="rounded-xl bg-[#e5f5eb] p-2.5 text-[#006c49]">
          <Icon size={20} />
        </span>
      </div>

      <p className="mt-4 font-hanken text-3xl font-bold text-[#17251c]">
        {value}
      </p>
    </div>
  );
}

function QuestionResults({ question, totalResponses, index }) {
  const options = Array.isArray(question.options)
    ? question.options
    : [];

  const textAnswers = Array.isArray(question.text_answers)
    ? question.text_answers
    : [];

  const answerCount = Number(question.answer_count ?? 0);

  return (
    <article className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[#17251c]">
            {index + 1}. {question.question_text || "Untitled question"}
          </p>

          <p className="mt-2 text-xs capitalize text-[#718078]">
            {getQuestionType(question)}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#f4fbf4] px-3 py-1.5 text-xs font-medium text-[#006c49]">
          {answerCount} answers
        </span>
      </div>

      {options.length > 0 && (
        <div className="mt-5 space-y-4">
          {options.map((option, optionIndex) => {
            const count = Number(option.selected_count ?? 0);

            // Use the number of responses for percentage calculation.
            const percentage =
              totalResponses > 0
                ? Math.min(100, (count / totalResponses) * 100)
                : 0;

            return (
              <div key={option.option_id ?? optionIndex}>
                <div className="mb-2 flex items-start justify-between gap-3 text-sm">
                  <span className="break-words text-[#26382d]">
                    {option.option_text || `Option ${optionIndex + 1}`}
                  </span>

                  <span className="shrink-0 text-[#53645a]">
                    {count} · {Math.round(percentage)}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[#e5eee7]">
                  <div
                    className="h-full rounded-full bg-[#006c49] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {question.average_rating != null && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <Star size={17} />
          Average rating:{" "}
          <strong>
            {Number(question.average_rating).toFixed(2)}
          </strong>
        </div>
      )}

      {textAnswers.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3 text-sm font-semibold text-[#26382d]">
            Text responses ({textAnswers.length})
          </h4>

          <div className="space-y-3">
            {textAnswers.map((answer, answerIndex) => (
              <div
                key={`${answer.submitted_at ?? "answer"}-${answerIndex}`}
                className="rounded-xl border border-[#e4ece5] bg-[#f9fbf9] p-4"
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#26382d]">
                  {answer.text_answer || "Empty response"}
                </p>

                {answer.submitted_at && (
                  <p className="mt-3 text-xs text-[#718078]">
                    Submitted:{" "}
                    {new Date(answer.submitted_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {options.length === 0 &&
        textAnswers.length === 0 &&
        question.average_rating == null && (
          <p className="mt-4 text-sm text-[#718078]">
            No detailed answer breakdown is available for this question.
          </p>
        )}
    </article>
  );
}

export default function ResponsesSection({ surveys = [] }) {
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (surveys.length === 0) {
      setSelectedSurveyId("");
      setStatistics(null);
      setError("");
      return;
    }

    const exists = surveys.some(
      (survey) =>
        String(getSurveyId(survey)) === selectedSurveyId
    );

    if (!exists) {
      setSelectedSurveyId(String(getSurveyId(surveys[0])));
    }
  }, [surveys, selectedSurveyId]);

  useEffect(() => {
    if (!selectedSurveyId) {
      setStatistics(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchStatistics() {
      setLoading(true);
      setError("");
      setStatistics(null);

      try {
        const response = await api.get(
          `/surveys/${selectedSurveyId}/statistics`
        );

        if (cancelled) return;

        const result = response.data;

        // Supports common API response wrappers.
        const data =
          result?.data?.statistics ??
          result?.data ??
          result?.statistics ??
          result;

        setStatistics(data);
      } catch (err) {
        if (cancelled) return;

        setStatistics(null);
        setError(
          err.response?.data?.message ||
            "Unable to load response statistics."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchStatistics();

    return () => {
      cancelled = true;
    };
  }, [selectedSurveyId, refreshKey]);

  const selectedSurvey = surveys.find(
    (survey) =>
      String(getSurveyId(survey)) === selectedSurveyId
  );

  const questions = Array.isArray(statistics?.questions)
    ? statistics.questions
    : [];

  const totalResponses = Number(
    statistics?.total_responses ??
      statistics?.totalResponses ??
      0
  );

  const refreshStatistics = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-hanken text-2xl font-bold">
            Responses
          </h2>

          <p className="mt-2 text-sm text-[#53645a]">
            Review submissions and analyze answers for each survey.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshStatistics}
          disabled={!selectedSurveyId || loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#bbcabf] bg-white px-4 py-2.5 text-sm font-medium text-[#006c49] hover:bg-[#f4fbf4] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <section className="rounded-2xl border border-[#bbcabf] bg-white p-5">
        <label
          htmlFor="responses-survey"
          className="mb-2 block text-sm font-medium text-[#26382d]"
        >
          Select survey
        </label>

        <select
          id="responses-survey"
          value={selectedSurveyId}
          onChange={(event) =>
            setSelectedSurveyId(event.target.value)
          }
          disabled={surveys.length === 0}
          className="w-full max-w-xl rounded-xl border border-[#bbcabf] bg-white px-4 py-3 text-sm outline-none focus:border-[#006c49]"
        >
          {surveys.length === 0 ? (
            <option value="">No surveys available</option>
          ) : (
            surveys.map((survey) => (
              <option
                key={getSurveyId(survey)}
                value={String(getSurveyId(survey))}
              >
                {getSurveyTitle(survey)}
              </option>
            ))
          )}
        </select>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={refreshStatistics}
            className="mt-3 text-sm font-semibold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <section className="rounded-2xl border border-[#bbcabf] bg-white">
          <EmptyState>Loading response statistics...</EmptyState>
        </section>
      ) : !selectedSurvey ? (
        <section className="rounded-2xl border border-[#bbcabf] bg-white">
          <EmptyState>
            Create a survey first to review its responses.
          </EmptyState>
        </section>
      ) : !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Total responses"
              value={totalResponses}
              icon={Users}
            />

            <StatCard
              title="Total questions"
              value={questions.length}
              icon={MessageSquareText}
            />
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#bbcabf] bg-white">
            <div className="flex items-start gap-3 border-b border-[#e4ece5] p-5 sm:p-6">
              <span className="rounded-xl bg-[#e5f5eb] p-3 text-[#006c49]">
                <BarChart3 size={22} />
              </span>

              <div className="min-w-0">
                <h3 className="font-hanken text-lg font-semibold">
                  Question results
                </h3>

                <p className="mt-1 break-words text-sm text-[#53645a]">
                  {getSurveyTitle(selectedSurvey)}
                </p>
              </div>
            </div>

            {questions.length === 0 ? (
              <EmptyState>
                No question statistics are available yet.
              </EmptyState>
            ) : (
              <div className="divide-y divide-[#e4ece5]">
                {questions.map((question, index) => (
                  <QuestionResults
                    key={question.question_id ?? index}
                    question={question}
                    totalResponses={totalResponses}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
