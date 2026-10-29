import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { Plus, Search, MoreVertical, Pencil, ListChecks, Copy, ExternalLink, Globe, LockKeyhole } from "lucide-react";
import { EmptyState, SurveyStatusBadge } from "./DashboardUI";

const getSurveyId = (survey) => survey.id ?? survey.survey_id;
const getSurveyTitle = (survey) =>
  survey.title || survey.name || "Untitled survey";
const getSurveyStatus = (survey) =>
  (survey.status || "DRAFT").toUpperCase();
const getResponseCount = (survey) =>
  Number(
    survey.response_count ??
      survey.responses_count ??
      survey.total_responses ??
      survey.responseCount ??
      0
  );

function SurveyActionsMenu({
  survey,
  onStatusChange,
  onCopyLink,
  onOpenSurvey,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const id = survey.id ?? survey.survey_id;
  const status = (survey.status || "DRAFT").toUpperCase();

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 224;
    const menuHeight = 240;
    const padding = 12;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove =
      spaceBelow < menuHeight && rect.top > spaceBelow;

    const top = openAbove
      ? Math.max(padding, rect.top - menuHeight - 6)
      : Math.min(
          window.innerHeight - menuHeight - padding,
          rect.bottom + 6
        );

    const left = Math.max(
      padding,
      Math.min(
        rect.right - menuWidth,
        window.innerWidth - menuWidth - padding
      )
    );

    setPosition({ top, left });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleOutsideClick = (event) => {
      if (
        !buttonRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleScroll = () => updatePosition();

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const handleAction = (callback) => {
    setOpen(false);
    callback?.(survey);
  };

  const nextStatus =
    status === "PUBLISHED" ? "CLOSED" : "PUBLISHED";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!open) {
            updatePosition();
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
        aria-label={`Actions for ${survey.title || survey.name || "survey"}`}
        aria-expanded={open}
        className="rounded-lg border border-[#bbcabf] p-2.5 text-[#3c4a42] hover:bg-[#f4fbf4] hover:text-[#006c49]"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] w-56 overflow-hidden rounded-xl border border-[#d8e3da] bg-white py-1 shadow-xl"
            style={{
              top: position.top,
              left: position.left,
              maxHeight: "min(320px, calc(100vh - 24px))",
              overflowY: "auto",
            }}
          >
            <Link
              to={`/dashboard/surveys/${id}/edit`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#26382d] hover:bg-[#f4fbf4]"
            >
              <Pencil size={16} />
              Edit survey
            </Link>

            <Link
              to={`/dashboard/surveys/${id}/questions`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#26382d] hover:bg-[#f4fbf4]"
            >
              <ListChecks size={16} />
              Manage questions
            </Link>

            <button
              type="button"
              onClick={() =>
                handleAction(() =>
                  onStatusChange?.(survey, nextStatus)
                )
              }
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#26382d] hover:bg-[#f4fbf4]"
            >
              {nextStatus === "PUBLISHED" ? (
                <Globe size={16} />
              ) : (
                <LockKeyhole size={16} />
              )}
              {nextStatus === "PUBLISHED"
                ? "Publish survey"
                : "Close survey"}
            </button>

            <div className="my-1 border-t border-[#e4ece5]" />

            <button
              type="button"
              onClick={() => handleAction(onCopyLink)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#26382d] hover:bg-[#f4fbf4]"
            >
              <Copy size={16} />
              Copy public link
            </button>

            <button
              type="button"
              onClick={() => handleAction(onOpenSurvey)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#26382d] hover:bg-[#f4fbf4]"
            >
              <ExternalLink size={16} />
              Open public survey
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

export default function SurveysSection({
  surveys = [],
  loading = false,
  error = "",
  onStatusChange,
  onCopyLink,
  onOpenSurvey,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredSurveys = surveys.filter((survey) => {
    const title = getSurveyTitle(survey).toLowerCase();
    const matchesSearch = title.includes(search.trim().toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      getSurveyStatus(survey) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-w-0 space-y-6">
      <section className="overflow-visible rounded-2xl border border-[#bbcabf] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#e4ece5] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-hanken text-xl font-bold sm:text-2xl">
              My Surveys
            </h2>
            <p className="mt-1 text-sm text-[#3c4a42]">
              Create, publish and manage your surveys.
            </p>
          </div>

          <Link
            to="/dashboard/surveys/new"
            className="primary-button shrink-0"
          >
            <Plus size={17} />
            Create survey
          </Link>
        </div>

        <div className="grid gap-3 border-b border-[#e4ece5] p-5 sm:grid-cols-[minmax(0,1fr)_180px]">
          <div className="relative min-w-0">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718078]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search surveys..."
              className="w-full rounded-xl border border-[#bbcabf] bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-[#bbcabf] bg-white px-3 py-3 text-sm outline-none focus:border-[#006c49]"
          >
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {error && (
          <p className="mx-5 mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <EmptyState>Loading surveys...</EmptyState>
        ) : filteredSurveys.length === 0 ? (
          <EmptyState>
            {surveys.length === 0
              ? "No surveys yet. Create your first survey."
              : "No surveys match your search or selected status."}
          </EmptyState>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[#f4fbf4] text-xs text-[#53645a]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Survey</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Responses</th>
                  <th className="px-4 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSurveys.map((survey) => {
                  const id = getSurveyId(survey);

                  return (
                    <tr
                      key={id ?? getSurveyTitle(survey)}
                      className="border-t border-[#e4ece5] transition hover:bg-[#fbfdfb]"
                    >
                      <td className="max-w-[280px] px-5 py-4">
                        <p className="truncate font-medium text-[#17251c]">
                          {getSurveyTitle(survey)}
                        </p>

                        {survey.description && (
                          <p className="mt-1 truncate text-xs text-[#718078]">
                            {survey.description}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <SurveyStatusBadge status={getSurveyStatus(survey)} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium">
                        {getResponseCount(survey)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#53645a]">
                        {survey.created_at || survey.createdAt
                          ? new Date(
                              survey.created_at || survey.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <SurveyActionsMenu
                          survey={survey}
                          onStatusChange={onStatusChange}
                          onCopyLink={onCopyLink}
                          onOpenSurvey={onOpenSurvey}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e4ece5] px-5 py-4 text-xs text-[#53645a]">
          <span>
            Showing {filteredSurveys.length} of {surveys.length} surveys
          </span>
          <span>Manage actions using the three-dot menu.</span>
        </div>
      </section>
    </div>
  );
}
