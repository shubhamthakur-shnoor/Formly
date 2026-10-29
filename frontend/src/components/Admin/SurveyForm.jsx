
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

const initialForm = {
  title: "",
  description: "",
  is_anonymous: true,
  start_at: "",
  end_at: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#bbcabf] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10";

export default function SurveyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const title = form.title.trim();

    if (!title) {
      setError("Survey title is required.");
      return;
    }

    if (
      form.start_at &&
      form.end_at &&
      new Date(form.end_at) <= new Date(form.start_at)
    ) {
      setError("The end date must be after the start date.");
      return;
    }

    const payload = {
      title,
      description: form.description.trim(),
      is_anonymous: form.is_anonymous,
      start_at: form.start_at
        ? new Date(form.start_at).toISOString()
        : null,
      end_at: form.end_at
        ? new Date(form.end_at).toISOString()
        : null,
    };

    setLoading(true);

    try {
      const { data } = await api.post("/surveys", payload);

      if (!data?.survey) {
        setError("The server did not return the created survey.");
        return;
      }

      navigate("/dashboard", {
        replace: true,
        state: {
          message: data.message || "Survey created successfully.",
          surveyId: data.survey.id,
        },
      });
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      setError(
        err.response?.data?.message ||
          (validationErrors
            ? "Please check your survey details."
            : "Unable to create the survey. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#bbcabf] bg-white p-5 sm:p-8"
    >
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#376850] hover:text-[#006c49]"
      >
        <ArrowLeft size={17} />
        Back to dashboard
      </button>

      <div className="border-b border-[#e4ece5] pb-5">
        <h2 className="font-hanken text-2xl font-bold">Survey details</h2>
        <p className="mt-2 text-sm text-[#3c4a42]">
          Enter the basic information and configure your response preferences.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="title" className="text-sm font-semibold">
            Survey title *
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Customer Feedback Survey"
            maxLength={200}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the purpose of your survey."
            rows={4}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="start_at" className="text-sm font-semibold">
              Start date and time
            </label>
            <input
              id="start_at"
              name="start_at"
              type="datetime-local"
              value={form.start_at}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="end_at" className="text-sm font-semibold">
              End date and time
            </label>
            <input
              id="end_at"
              name="end_at"
              type="datetime-local"
              min={form.start_at || undefined}
              value={form.end_at}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#bbcabf] p-4">
          <input
            type="checkbox"
            name="is_anonymous"
            checked={form.is_anonymous}
            onChange={handleChange}
            className="mt-1 accent-[#006c49]"
          />
          <span>
            <span className="block text-sm font-semibold">
              Anonymous responses
            </span>
            <span className="mt-1 block text-sm text-[#3c4a42]">
              Allow respondents to submit feedback anonymously.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-7 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {loading ? "Creating survey..." : "Create survey"}
        </button>
      </div>
    </form>
  );
}
