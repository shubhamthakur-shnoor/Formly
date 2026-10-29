import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ClipboardList, Search } from "lucide-react";
import api from "../services/api";

export default function PublicSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  let cancelled = false;

  const fetchSurveys = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/surveys/public");

      if (!cancelled) {
        setSurveys(
          Array.isArray(data?.surveys) ? data.surveys : []
        );
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err.response?.data?.message ||
            "Unable to load surveys. Please try again."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchSurveys();

  const handleFocus = () => fetchSurveys();
  window.addEventListener("focus", handleFocus);

  return () => {
    cancelled = true;
    window.removeEventListener("focus", handleFocus);
  };
}, []);

  const filteredSurveys = surveys.filter((survey) =>
    `${survey.title} ${survey.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f4fbf4] text-[#161d19]">
      <header className="border-b border-[#bbcabf] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link to="/" className="text-2xl font-bold text-[#006c49]">
            Formly
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-[#376850] hover:text-[#006c49]"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f5e9] px-4 py-2 text-sm font-semibold text-[#006c49]">
            <ClipboardList size={16} />
            Public Surveys
          </span>

          <h1 className="mt-5 font-hanken text-4xl font-bold tracking-tight sm:text-5xl">
            Your opinion matters.
          </h1>

          <p className="mt-4 text-base leading-7 text-[#3c4a42]">
            Explore available surveys, share your feedback, and help make
            better decisions.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-xl">
          <div className="flex items-center gap-3 rounded-xl border border-[#bbcabf] bg-white px-4 py-3 shadow-sm focus-within:border-[#006c49]">
            <Search size={20} className="shrink-0 text-[#376850]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search surveys..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#849187]"
            />
          </div>
        </div>

        {!loading && !error && (
          <p className="mb-5 text-sm text-[#3c4a42]">
            {filteredSurveys.length}{" "}
            {filteredSurveys.length === 1 ? "survey" : "surveys"} available
          </p>
        )}

        {loading ? (
          <div className="py-20 text-center text-[#376850]">
            Loading surveys...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#006c49] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#bbcabf] bg-white px-6 py-16 text-center">
            <ClipboardList
              size={38}
              className="mx-auto mb-4 text-[#376850]"
            />
            <h2 className="text-xl font-bold">
              {search ? "No matching surveys" : "No surveys available yet"}
            </h2>
            <p className="mt-2 text-sm text-[#3c4a42]">
              {search
                ? "Try a different search term."
                : "Published surveys will appear here. Please check back soon."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSurveys.map((survey) => (
              <article
                key={survey.survey_id}
                className="group flex flex-col rounded-2xl border border-[#bbcabf] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#0fb981] hover:shadow-md"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#e0f5e9] text-[#006c49]">
                    <ClipboardList size={24} />
                  </div>

                  <span className="rounded-full bg-[#e0f5e9] px-3 py-1 text-xs font-semibold text-[#006c49]">
                    Available
                  </span>
                </div>

                <h2 className="font-hanken text-xl font-bold">
                  {survey.title}
                </h2>

                <p className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-6 text-[#3c4a42]">
                  {survey.description || "Share your feedback with us."}
                </p>

                <div className="mt-6 border-t border-[#e5ece6] pt-4">
                  <Link
                    to={`/survey/${encodeURIComponent(survey.slug)}`}
                    className="primary-button flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold"
                  >
                    Participate Now
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}