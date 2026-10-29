import { Link } from "react-router-dom";
import { Plus, ClipboardList, CheckCircle2, Users, FileEdit } from "lucide-react";
import { MetricCard, EmptyState, SurveyStatusBadge } from "./DashboardUI";
import AnalyticsSection from "./AnalyticsSection";

const getStatus = (survey) =>
  (survey.status || "DRAFT").toUpperCase();
const getResponses = (survey) =>
  Number(
    survey.response_count ??
      survey.responses_count ??
      survey.total_responses ??
      survey.responseCount ??
      0
  );

export default function DashboardOverview({
  surveys = [],
  loading,
  error,
  adminName = "Admin",
  onViewAll,
}) {
  const publishedCount = surveys.filter(
    (survey) => getStatus(survey) === "PUBLISHED"
  ).length;

  const draftCount = surveys.filter(
    (survey) => getStatus(survey) === "DRAFT"
  ).length;

  const totalResponses = surveys.reduce(
    (total, survey) => total + getResponses(survey),
    0
  );
  const recentSurveys = surveys.slice(0, 5);
  return (
    <>
      <div className="mb-7">
        <h2 className="font-hanken text-2xl font-bold">
          Welcome, {adminName}
        </h2>

        <p className="mt-2 text-sm text-[#3c4a42]">
          Here is an overview of your surveys, responses, and performance.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total surveys"
          value={surveys.length}
          description="All created surveys"
          icon={ClipboardList}
        />
        <MetricCard
          title="Published"
          value={publishedCount}
          description="Currently published"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Total responses"
          value={totalResponses}
          description="Across all surveys"
          icon={Users}
        />
        <MetricCard
          title="Drafts"
          value={draftCount}
          description="Not yet published"
          icon={FileEdit}
        />
      </div>
      <div className="mt-6">
        <AnalyticsSection surveys={surveys} />
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#bbcabf] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h2 className="font-hanken text-xl font-semibold">
              Recent surveys
            </h2>
            <p className="mt-1 text-sm text-[#3c4a42]">
              Manage and review your surveys.
            </p>
          </div>
          <Link
            to="/dashboard/surveys/new"
            className="primary-button"
          >
            <Plus size={17} />
            Create survey
          </Link>
        </div>
        {error && (
          <p className="mx-5 mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <EmptyState>Loading surveys...</EmptyState>
        ) : recentSurveys.length === 0 ? (
          <EmptyState>
            No surveys yet. Create your first survey to get started.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-[#f4fbf4] text-xs text-[#3c4a42]">
                <tr>
                  {["Survey", "Status", "Responses", "Created"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 font-medium"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {recentSurveys.map((survey) => {
                  const id = survey.id ?? survey.survey_id;
                  return (
                    <tr
                      key={id ?? survey.title}
                      className="border-t border-[#e4ece5]"
                    >
                      <td className="px-5 py-4 font-medium">
                        {survey.title || survey.name || "Untitled survey"}
                      </td>

                      <td className="px-5 py-4">
                        <SurveyStatusBadge
                          status={getStatus(survey)}
                        />
                      </td>

                      <td className="px-5 py-4">
                        {getResponses(survey)}
                      </td>

                      <td className="px-5 py-4 text-[#3c4a42]">
                        {survey.created_at || survey.createdAt
                          ? new Date(
                              survey.created_at || survey.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-[#bbcabf] px-5 py-4">
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-semibold text-[#006c49]"
          >
            View all surveys
          </button>
        </div>
      </section>
    </>
  );
}
