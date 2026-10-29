import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import api from "../../services/api";

const questionTypes = [
  { value: "SHORT_ANSWER", label: "Short answer" },
  { value: "LONG_ANSWER", label: "Long answer" },
  { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { value: "RATING", label: "Rating (1–5)" },
];

const createEmptyForm = () => ({
  question_text: "",
  question_type: "SHORT_ANSWER",
  is_required: false,
  options: ["", ""],
});

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#bbcabf] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10";

const getQuestionId = (question) =>
  question.question_id ?? question.id;

const getOptions = (question) =>
  Array.isArray(question.options)
    ? question.options.map((option) =>
        typeof option === "string" ? option : option.option_text
      )
    : [];

export default function SurveyQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(createEmptyForm);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [surveyResponse, questionResponse] = await Promise.all([
        api.get(`/surveys/${id}`),
        api.get(`/surveys/${id}/questions`),
      ]);

      const surveyData =
        surveyResponse.data?.survey ??
        surveyResponse.data?.data?.survey;

      const questionData =
        questionResponse.data?.questions ??
        questionResponse.data?.data?.questions ??
        [];

      if (!surveyData) {
        throw new Error("Survey not found.");
      }

      setSurvey(surveyData);
      setQuestions(
        [...questionData].sort(
          (a, b) => a.question_order - b.question_order
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load questions."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function openNewForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function openEditForm(question) {
    const options = getOptions(question);

    setEditingId(getQuestionId(question));
    setForm({
      question_text: question.question_text ?? "",
      question_type: question.question_type,
      is_required: Boolean(question.is_required),
      options:
        question.question_type === "MULTIPLE_CHOICE"
          ? options.length >= 2
            ? options
            : ["", ""]
          : [],
    });

    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setError("");
  }

  function changeField(event) {
    const { name, value, checked, type } = event.target;

    if (name === "question_type") {
      setForm((current) => ({
        ...current,
        question_type: value,
        options:
          value === "MULTIPLE_CHOICE"
            ? current.question_type === "MULTIPLE_CHOICE"
              ? current.options
              : ["", ""]
            : [],
      }));
    } else {
      setForm((current) => ({
        ...current,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    setError("");
  }

  function changeOption(index, value) {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, i) =>
        i === index ? value : option
      ),
    }));
    setError("");
  }

  function addOption() {
    setForm((current) => ({
      ...current,
      options: [...current.options, ""],
    }));
  }

  function removeOption(index) {
    setForm((current) => ({
      ...current,
      options: current.options.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const questionText = form.question_text.trim();
    const options = form.options.map((option) => option.trim());

    if (!questionText) {
      setError("Enter a question.");
      return;
    }

    if (
      form.question_type === "MULTIPLE_CHOICE" &&
      (options.filter(Boolean).length < 2 || options.some((x) => !x))
    ) {
      setError("Add at least two options and complete each one.");
      return;
    }

    const existingQuestion = editingId
      ? questions.find(
          (question) =>
            String(getQuestionId(question)) === String(editingId)
        )
      : null;

    const nextOrder =
      questions.reduce(
        (max, question) =>
          Math.max(max, Number(question.question_order) || 0),
        0
      ) + 1;

    const payload = {
      question_text: questionText,
      question_type: form.question_type,
      is_required: form.is_required,
      question_order: existingQuestion?.question_order ?? nextOrder,
      options:
        form.question_type === "MULTIPLE_CHOICE" ? options : [],
    };

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/questions/${editingId}`, payload);
      } else {
        await api.post(`/surveys/${id}/questions`, payload);
      }

      closeForm();
      setNotice(
        editingId ? "Question updated." : "Question added."
      );
      await fetchQuestions();
    } catch (err) {
      const firstIssue = err.response?.data?.errors?.[0]?.message;
      setError(
        firstIssue ||
          err.response?.data?.message ||
          "Unable to save the question."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(question) {
    const questionId = getQuestionId(question);
    if (!window.confirm("Delete this question?")) return;
    setError("");
    setNotice("");
    setDeletingId(questionId);

    try {
      await api.delete(`/questions/${questionId}`);
      setQuestions((current) =>
        current.filter(
          (item) =>
            String(getQuestionId(item)) !== String(questionId)
        )
      );
      setNotice("Question deleted.");
      if (String(editingId) === String(questionId)) {
        closeForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the question."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4fbf4] px-4 py-6 text-[#161d19] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-[#376850] hover:text-[#006c49]"
        >
          <ArrowLeft size={16} />
          Surveys
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-hanken text-2xl font-bold">
              {survey?.title || "Survey Questions"}
            </h1>
            <p className="mt-1 text-sm text-[#3c4a42]">
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"}
            </p>
          </div>

          <button
            type="button"
            onClick={openNewForm}
            className="primary-button"
          >
            <Plus size={16} />
            Add question
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mt-4 rounded-lg border border-[#bbcabf] bg-white px-3 py-2.5 text-sm text-[#006c49]"
          >
            {notice}
          </div>
        )}

        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="mt-5 rounded-xl border border-[#bbcabf] bg-white p-4 sm:p-6"
          >
            <div className="flex items-center justify-between border-b border-[#e4ece5] pb-3">
              <h2 className="font-hanken text-lg font-semibold">
                {editingId ? "Edit question" : "New question"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg p-2 text-[#376850] hover:bg-[#f4fbf4]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <label
                htmlFor="question_text"
                className="text-sm font-medium"
              >
                Question <span className="text-red-600">*</span>
              </label>
              <textarea
                id="question_text"
                name="question_text"
                value={form.question_text}
                onChange={changeField}
                maxLength={1000}
                rows={2}
                required
                className={inputClass}
                placeholder="Enter question"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="question_type"
                className="text-sm font-medium"
              >
                Answer type
              </label>
              <select
                id="question_type"
                name="question_type"
                value={form.question_type}
                onChange={changeField}
                className={inputClass}
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {form.question_type === "MULTIPLE_CHOICE" && (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium">
                    Options
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-sm font-medium text-[#006c49] hover:underline"
                  >
                    + Add option
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {form.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        value={option}
                        onChange={(event) =>
                          changeOption(index, event.target.value)
                        }
                        maxLength={255}
                        required
                        aria-label={`Option ${index + 1}`}
                        placeholder={`Option ${index + 1}`}
                        className={inputClass.replace("mt-1.5 ", "")}
                      />

                      <button
                        type="button"
                        disabled={form.options.length <= 2}
                        onClick={() => removeOption(index)}
                        aria-label={`Remove option ${index + 1}`}
                        className="rounded-lg p-2 text-[#64746a] hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm font-medium">
              <input
                type="checkbox"
                name="is_required"
                checked={form.is_required}
                onChange={changeField}
                className="size-4 accent-[#006c49]"
              />
              Required question
            </label>

            <div className="mt-5 flex justify-end gap-2 border-t border-[#e4ece5] pt-4">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-[#bbcabf] px-3.5 py-2.5 text-sm font-medium hover:bg-[#f4fbf4]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="primary-button disabled:opacity-60"
              >
                <Save size={16} />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Add question"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-5 space-y-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-[#3c4a42]">
              Loading questions...
            </p>
          ) : questions.length === 0 ? (
            <div className="rounded-xl border border-[#bbcabf] bg-white p-7 text-center">
              <p className="text-sm text-[#3c4a42]">
                No questions added yet.
              </p>
              <button
                type="button"
                onClick={openNewForm}
                className="mt-3 text-sm font-semibold text-[#006c49] hover:underline"
              >
                + Add question
              </button>
            </div>
          ) : (
            questions.map((question, index) => (
              <article
                key={getQuestionId(question)}
                className="rounded-xl border border-[#bbcabf] bg-white p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e5f5eb] text-sm font-semibold text-[#006c49]">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="whitespace-pre-wrap break-words text-sm font-semibold leading-6">
                      {question.question_text}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#f4fbf4] px-2 py-1 text-xs text-[#376850]">
                        {questionTypes.find(
                          (type) =>
                            type.value === question.question_type
                        )?.label || question.question_type}
                      </span>

                      {question.is_required && (
                        <span className="text-xs text-amber-700">
                          Required
                        </span>
                      )}
                    </div>

                    {question.question_type === "MULTIPLE_CHOICE" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getOptions(question).map((option, optionIndex) => (
                          <span
                            key={optionIndex}
                            className="rounded-lg border border-[#e0e8e1] px-3 py-1.5 text-sm text-[#3c4a42]"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    )}

                    {question.question_type === "RATING" && (
                      <p className="mt-3 text-xs text-[#3c4a42]">
                        Rating · 1–5
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(question)}
                      aria-label="Edit question"
                      title="Edit"
                      className="rounded-lg p-2 text-[#376850] hover:bg-[#e5f5eb] hover:text-[#006c49]"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(question)}
                      disabled={
                        String(deletingId) ===
                        String(getQuestionId(question))
                      }
                      aria-label="Delete question"
                      title="Delete"
                      className="rounded-lg p-2 text-[#64746a] hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
