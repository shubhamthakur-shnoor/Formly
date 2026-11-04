
import { ClipboardList, ArrowRight, CalendarDays } from "lucide-react";

export default function AvailableSurveys({
  surveys = [],
  loading = false,
  error = "",
  onParticipate,
}) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-2xl bg-white"
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

  if (!surveys.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-5 py-16 text-center">
        <ClipboardList
          size={35}
          className="mx-auto text-[#829087]"
        />
        <h3 className="mt-4 font-hanken text-lg font-bold text-[#17251c]">
          No surveys available
        </h3>
        <p className="mt-2 text-sm text-[#718078]">
          Published surveys will appear here when they become available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {surveys.map((survey) => {
        const surveyId = survey.survey_id ?? survey.id;

        return (
          <article
            key={surveyId}
            className="flex flex-col rounded-2xl border border-[#dce7dd] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4ec] text-[#006c49]">
              <ClipboardList size={21} />
            </div>

            <h3 className="mt-4 font-hanken text-lg font-bold text-[#17251c]">
              {survey.title}
            </h3>

            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[#718078]">
              {survey.description || "Share your feedback through this survey."}
            </p>

            {survey.end_at && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#718078]">
                <CalendarDays size={15} />
                <span>
                  Ends: {new Date(survey.end_at).toLocaleDateString()}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onParticipate?.(survey)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#006c49] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00563a]"
            >
              Participate
              <ArrowRight size={16} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
