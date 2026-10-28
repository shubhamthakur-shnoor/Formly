import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  "mt-1.5 w-full rounded-lg border border-[#bbcabf] bg-white px-3.5 py-2.5 text-sm text-[#161d19] outline-none transition focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10";

function toLocalDateTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSurvey() {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/surveys/${id}`);
        const survey = data?.survey ?? data?.data?.survey;

        if (!survey) {
          throw new Error("Survey not found.");
        }

        if (!cancelled) {
          setForm({
            title: survey.title ?? "",
            description: survey.description ?? "",
            is_anonymous: survey.is_anonymous ?? true,
            start_at: toLocalDateTime(survey.start_at),
            end_at: toLocalDateTime(survey.end_at),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load survey."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSurvey();

    return () => {
      cancelled = true;
    };
  }, [id]);

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
      setError("Enter a survey title.");
      return;
    }

    if (
      form.start_at &&
      form.end_at &&
      new Date(form.end_at) <= new Date(form.start_at)
    ) {
      setError("End date must be after the start date.");
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

    try {
      setSaving(true);

      await api.put(`/surveys/${id}`, payload);

      navigate("/dashboard", {
        replace: true,
        state: { message: "Survey updated successfully." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4fbf4] p-6 text-sm text-[#3c4a42]">
        Loading survey...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4fbf4] px-4 py-6 text-[#161d19] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-5 inline-flex items-center gap-2 text-sm text-[#376850] hover:text-[#006c49]"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[#bbcabf] bg-white p-5 sm:p-7"
        >
          <div className="flex items-center justify-between border-b border-[#e4ece5] pb-4">
            <h1 className="font-hanken text-2xl font-bold">
              Edit survey
            </h1>
          </div>

          <div className="mt-5">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={200}
              required
              className={inputClass}
              placeholder="Survey title"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="Optional description"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start_at" className="text-sm font-medium">
                Start date
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
              <label htmlFor="end_at" className="text-sm font-medium">
                End date
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

          <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={form.is_anonymous}
              onChange={handleChange}
              className="size-4 accent-[#006c49]"
            />
            Anonymous responses
          </label>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t border-[#e4ece5] pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-[#bbcabf] px-4 py-2.5 text-sm font-medium hover:bg-[#f4fbf4]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
