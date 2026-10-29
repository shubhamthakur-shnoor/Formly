import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import api from "../../services/api";
import { EmptyState } from "./DashboardUI";

const getSurveyId = (survey) => survey.id ?? survey.survey_id;

export default function ExportsSection({ surveys = [] }) {
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleExport = async () => {
    if (!selectedSurveyId) {
      setError("Please select a survey first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get(
        `/surveys/${selectedSurveyId}/export`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const selectedSurvey = surveys.find(
        (survey) =>
          String(getSurveyId(survey)) === String(selectedSurveyId)
      );
      const fileName = (
        selectedSurvey?.title ||
        selectedSurvey?.name ||
        "survey-responses"
      )
        .trim()
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/^-+|-+$/g, "");
      link.href = downloadUrl;
      link.download = `${fileName || "survey-responses"}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setSuccess("CSV export downloaded successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to export responses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-hanken text-2xl font-bold">
          Export responses
        </h2>
        <p className="mt-2 text-sm text-[#3c4a42]">
          Download survey response data as a CSV file.
        </p>
      </div>

      {surveys.length === 0 ? (
        <section className="rounded-2xl border border-[#bbcabf] bg-white">
          <EmptyState>
            No surveys available to export.
          </EmptyState>
        </section>
      ) : (
        <section className="max-w-2xl rounded-2xl border border-[#bbcabf] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#e5f5eb] p-3 text-[#006c49]">
              <FileSpreadsheet size={25} />
            </div>
            <div>
              <h3 className="font-hanken text-lg font-semibold">
                Survey response export
              </h3>
              <p className="mt-1 text-sm text-[#3c4a42]">
                Select a survey to download its response data for
                reporting and analysis.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor="export-survey"
              className="mb-2 block text-sm font-medium"
            >
              Select survey
            </label>
            <select
              id="export-survey"
              value={selectedSurveyId}
              onChange={(event) => {
                setSelectedSurveyId(event.target.value);
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-xl border border-[#bbcabf] bg-white px-3 py-3 text-sm outline-none focus:border-[#006c49]"
            >
              <option value="">Choose a survey</option>
              {surveys.map((survey) => (
                <option
                  key={getSurveyId(survey)}
                  value={String(getSurveyId(survey))}
                >
                  {survey.title || survey.name || "Untitled survey"}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 rounded-lg bg-[#e5f5eb] p-3 text-sm text-[#006c49]">
              {success}
            </p>
          )}
          <button
            type="button"
            onClick={handleExport}
            disabled={!selectedSurveyId || loading}
            className="primary-button mt-5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download
              size={17}
              className={loading ? "animate-bounce" : ""}
            />
            {loading ? "Exporting..." : "Download CSV"}
          </button>
        </section>
      )}
    </div>
  );
}