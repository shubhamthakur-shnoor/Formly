import SurveyForm from "./SurveyForm";

export default function CreateSurvey() {
  return (
    <main className="min-h-screen bg-[#f4fbf4] px-5 py-10 text-[#161d19] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="font-jetbrains text-xs uppercase tracking-widest text-[#376850]">
          Admin workspace
        </p>

        <h1 className="mt-2 font-hanken text-3xl font-bold">
          Create a survey
        </h1>

        <p className="mt-2 text-sm text-[#3c4a42]">
          Set up your survey before adding questions.
        </p>

        <div className="mt-7">
          <SurveyForm />
        </div>
      </div>
    </main>
  );
}
