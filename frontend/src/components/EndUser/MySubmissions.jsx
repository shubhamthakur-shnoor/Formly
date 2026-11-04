import { FileCheck2, CalendarDays, Eye, X, LoaderCircle, ClipboardList } from "lucide-react";

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAnswer(question) {
  switch (question.question_type) {
    case "MULTIPLE_CHOICE":
      return question.selected_option_text || "Not answered";

    case "RATING":
      return question.rating_score != null
        ? `${question.rating_score} / 5`
        : "Not answered";

    case "SHORT_ANSWER":
    case "LONG_ANSWER":
      return question.text_answer?.trim() || "Not answered";

    default:
      return "Not answered";
  }
}

export default function MySubmissions({
  submissions = [],
  loading = false,
  error = "",
  onViewSubmission,
  selectedSubmission,
  submissionDetail,
  detailLoading = false,
  detailError = "",
  onCloseSubmission,
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl bg-white"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <>
      {!submissions.length ? (
        <div className="rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-5 py-16 text-center">
          <FileCheck2 size={35} className="mx-auto text-[#829087]" />
          <h3 className="mt-4 font-hanken text-lg font-bold text-[#17251c]">
            No submissions yet
          </h3>
          <p className="mt-2 text-sm text-[#718078]">
            Your completed surveys and submission history will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#dce7dd] bg-white">
          <div className="border-b border-[#e6eee7] p-5">
            <h3 className="font-hanken text-lg font-bold text-[#17251c]">
              My Submissions
            </h3>
            <p className="mt-1 text-sm text-[#718078]">
              All your completed surveys and submission history.
            </p>
          </div>

          <div className="divide-y divide-[#e6eee7]">
            {submissions.map((submission) => (
              <div
                key={submission.response_id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#eaf4ec] p-2.5 text-[#006c49]">
                    <FileCheck2 size={19} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#17251c]">
                      {submission.survey_title || "Survey"}
                    </h4>

                    <p className="mt-2 flex items-center gap-2 text-xs text-[#718078]">
                      <CalendarDays size={14} />
                      Submitted: {formatDate(submission.submitted_at)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewSubmission?.(submission)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce7dd] px-4 py-2.5 text-sm font-medium text-[#006c49] transition hover:bg-[#f4f8f4]"
                >
                  <Eye size={16} />
                  View submission
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onCloseSubmission?.();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#176b4b]">
                  <ClipboardList size={17} />
                  Submitted Response
                </div>

                <h2 className="break-words text-xl font-bold text-gray-900">
                  {submissionDetail?.survey_title ||
                    selectedSubmission.survey_title ||
                    "Survey"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Submitted: {formatDate(
                    submissionDetail?.submitted_at ||
                    selectedSubmission.submitted_at
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={onCloseSubmission}
                aria-label="Close"
                className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              {detailLoading ? (
                <div className="flex flex-col items-center py-16 text-[#176b4b]">
                  <LoaderCircle size={32} className="animate-spin" />
                  <p className="mt-3 text-sm text-gray-500">
                    Loading your submitted answers...
                  </p>
                </div>
              ) : detailError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {detailError}
                </div>
              ) : submissionDetail?.questions?.length ? (
                <div className="space-y-4">
                  {submissionDetail.questions.map((question, index) => (
                    <div
                      key={question.question_id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f5ed] text-sm font-bold text-[#176b4b]">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-semibold leading-6 text-gray-900">
                            {question.question_text}
                          </h3>

                          <span className="mt-1 inline-block text-xs text-gray-400">
                            {question.question_type?.replaceAll("_", " ").toLowerCase()}
                          </span>

                          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Your answer
                            </p>
                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                              {getAnswer(question)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-gray-500">
                  No answer details are available for this submission.
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-gray-100 p-4 sm:px-6">
              <button
                type="button"
                onClick={onCloseSubmission}
                className="rounded-lg bg-[#176b4b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#10583d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
