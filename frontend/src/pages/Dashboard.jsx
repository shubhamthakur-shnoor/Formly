
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu, Plus, RefreshCw, Search, Users,
  ClipboardList, CheckCircle2, FileEdit,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

import Sidebar from "../components/Admin/Sidebar";
import api from "../services/api";

const COLORS = ["#006c49", "#0fb981", "#8abf9e"];

const getSurveys = (data) =>
  Array.isArray(data) ? data :
  data?.surveys ?? data?.data?.surveys ?? data?.data ?? [];

const getStatus = (survey) => (survey.status || "DRAFT").toUpperCase();

const getResponses = (survey) =>
  Number(
    survey.response_count ??
    survey.responses_count ??
    survey.total_responses ??
    survey.responseCount ?? 0
  );

function MetricCard({ title, value, description, icon: Icon }) {
  return (
    <article className="flex justify-between rounded-2xl border border-[#bbcabf] bg-white p-5">
      <div>
        <p className="text-sm text-[#3c4a42]">{title}</p>
        <p className="mt-3 font-hanken text-3xl font-bold">{value}</p>
        <p className="mt-2 text-xs text-[#3c4a42]">{description}</p>
      </div>
      <span className="h-fit rounded-xl bg-[#e5f5eb] p-3 text-[#006c49]">
        <Icon size={21} />
      </span>
    </article>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-[#bbcabf] bg-white p-5">
      <h2 className="font-hanken text-lg font-semibold">{title}</h2>
      <div className="mt-5 h-64">{children}</div>
    </section>
  );
}

function EmptyState({ children }) {
  return (
    <div className="flex h-full min-h-40 items-center justify-center text-center text-sm text-[#3c4a42]">
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [adminName, setAdminName] = useState(
    () => localStorage.getItem("full_name") || "Admin"
  );

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/surveys");
      setSurveys(getSurveys(data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load surveys. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  useEffect(() => {
    const name = localStorage.getItem("full_name");
    if (name) setAdminName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("full_name");
    navigate("/signin", { replace: true });
  };

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

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const title = (survey.title || survey.name || "").toLowerCase();

      return (
        title.includes(search.toLowerCase()) &&
        (statusFilter === "ALL" || getStatus(survey) === statusFilter)
      );
    });
  }, [surveys, search, statusFilter]);

  const responseData = surveys.slice(0, 7).map((survey) => ({
    name: (survey.title || survey.name || "Untitled").slice(0, 18),
    responses: getResponses(survey),
  }));

  const statusData = [
    { name: "Published", value: publishedCount },
    { name: "Draft", value: draftCount },
    {
      name: "Closed",
      value: surveys.filter((survey) => getStatus(survey) === "CLOSED").length,
    },
  ].filter((item) => item.value > 0);

  const renderSurveyTable = (compact = false) => {
    const rows = compact ? filteredSurveys.slice(0, 5) : filteredSurveys;

    if (loading) return <EmptyState>Loading surveys...</EmptyState>;

    if (rows.length === 0) {
      return (
        <EmptyState>
          {surveys.length === 0
            ? "No surveys yet. Create your first survey to get started."
            : "No matching surveys found."}
        </EmptyState>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-[#f4fbf4] text-xs text-[#3c4a42]">
            <tr>
              {["Survey", "Status", "Responses", "Created", "Action"].map(
                (heading) => (
                  <th key={heading} className="px-5 py-4 font-medium">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((survey) => {
              const id = survey.id ?? survey.survey_id;
              const status = getStatus(survey);

              return (
                <tr key={id ?? survey.title} className="border-t border-[#e4ece5]">
                  <td className="px-5 py-4 font-medium">
                    {survey.title || survey.name || "Untitled survey"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${
                      status === "PUBLISHED"
                        ? "bg-[#e5f5eb] text-[#006c49]"
                        : status === "CLOSED"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-amber-50 text-amber-700"
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{getResponses(survey)}</td>
                  <td className="px-5 py-4 text-[#3c4a42]">
                    {survey.created_at || survey.createdAt
                      ? new Date(
                          survey.created_at || survey.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      disabled={id == null}
                      onClick={() => navigate(`/dashboard/surveys/${id}`)}
                      className="font-medium text-[#006c49] hover:underline disabled:opacity-40"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCharts = () => (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Responses by survey">
        {responseData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="responses" fill="#006c49" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>Response analytics will appear here once surveys have data.</EmptyState>
        )}
      </ChartCard>

      <ChartCard title="Survey status">
        {statusData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={85}
                paddingAngle={3}
              >
                {statusData.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>No survey status data available yet.</EmptyState>
        )}
      </ChartCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4fbf4] text-[#161d19]">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#bbcabf] bg-white/95 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-[#f4fbf4] lg:hidden"
            >
              <Menu size={21} />
            </button>
            <div>
                <h1 className="font-hanken text-xl font-bold sm:text-2xl">
                {activePage}
                </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchSurveys}
            disabled={loading}
            aria-label="Refresh surveys"
            className="rounded-xl border border-[#bbcabf] p-2.5 text-[#376850] hover:bg-[#f4fbf4] disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        <main className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {activePage === "Overview" && (
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
                <MetricCard title="Total surveys" value={surveys.length} description="All created surveys" icon={ClipboardList} />
                <MetricCard title="Published" value={publishedCount} description="Currently published" icon={CheckCircle2} />
                <MetricCard title="Total responses" value={totalResponses} description="Across all surveys" icon={Users} />
                <MetricCard title="Drafts" value={draftCount} description="Not yet published" icon={FileEdit} />
              </div>

              <div className="mt-6">{renderCharts()}</div>

              <section className="mt-8 overflow-hidden rounded-2xl border border-[#bbcabf] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <h2 className="font-hanken text-xl font-semibold">Recent surveys</h2>
                    <p className="mt-1 text-sm text-[#3c4a42]">Manage and review your surveys.</p>
                  </div>
                  <Link to="/dashboard/surveys/new" className="primary-button">
                    <Plus size={17} /> Create survey
                  </Link>
                </div>
                {error && <p className="mx-5 mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                {renderSurveyTable(true)}
                <div className="border-t border-[#bbcabf] px-5 py-4">
                  <button onClick={() => setActivePage("My Surveys")} className="text-sm font-semibold text-[#006c49]">
                    View all surveys
                  </button>
                </div>
              </section>
            </>
          )}

          {activePage === "My Surveys" && (
            <section className="overflow-hidden rounded-2xl border border-[#bbcabf] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <h2 className="font-hanken text-xl font-semibold">All surveys</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-[#bbcabf] px-3">
                    <Search size={16} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search surveys..."
                      className="w-40 bg-transparent py-2.5 text-sm outline-none"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="rounded-xl border border-[#bbcabf] bg-white px-3 text-sm"
                  >
                    <option value="ALL">All statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
              {error && <p className="mx-5 mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              {renderSurveyTable()}
            </section>
          )}

          {activePage === "Analytics" && renderCharts()}

          {(activePage === "Responses" || activePage === "Exports" || activePage === "Settings") && (
            <section className="rounded-2xl border border-[#bbcabf] bg-white p-6">
              <h2 className="font-hanken text-xl font-semibold">{activePage}</h2>
              <p className="mt-2 text-sm text-[#3c4a42]">
                {activePage === "Responses" && "View and analyze responses submitted to your surveys."}
                {activePage === "Exports" && "Export your survey responses and reports as CSV files."}
                {activePage === "Settings" && "Manage your workspace settings."}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
