import {ArrowDown, ArrowRight, BarChart3, CheckCircle2, ChevronRight, ClipboardCheck, Download, FileText, Link2, MessageSquareText, ShieldCheck, Sparkles} from "lucide-react";

const features = [
  {
    icon: FileText,
    number: "01",
    title: "Create surveys",
    description:
      "Build surveys with a clear structure and questions tailored to your goals.",
  },
  {
    icon: MessageSquareText,
    number: "02",
    title: "Flexible questions",
    description:
      "Use multiple choice, ratings, short answers and long-form questions to collect useful feedback.",
  },
  {
    icon: Link2,
    number: "03",
    title: "Share with a link",
    description:
      "Share a unique survey link with customers, students, teammates or your community.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Understand responses",
    description:
      "Review response statistics and identify useful patterns in the feedback you collect.",
  },
  {
    icon: ShieldCheck,
    number: "05",
    title: "Respect privacy",
    description:
      "Choose anonymous or identified responses based on the needs of your survey.",
  },
  {
    icon: Download,
    number: "06",
    title: "Export your data",
    description:
      "Download responses as CSV files for reporting, record keeping and further analysis.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your survey",
    description:
      "Add a title, write a description and choose the questions you want to ask.",
  },
  {
    number: "02",
    title: "Share it with others",
    description:
      "Publish your survey and send its unique link to your intended audience.",
  },
  {
    number: "03",
    title: "Review the results",
    description:
      "Collect responses, explore statistics and export your data whenever you need it.",
  },
];

function SectionLabel({ children }) {
  return (
    <p className="mb-4 flex items-center justify-center gap-2 font-jetbrains text-xs font-medium uppercase tracking-[0.16em] text-primary">
      <span className="h-2 w-2 rounded-full bg-primary" />
      {children}
    </p>
  );
}

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4fbf4] text-ink">
      <header className="sticky top-0 z-50 bg-[#f4fbf4]/95 backdrop-blur-md">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8"
        >
          <a href="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <FileText size={21} />
            </span>
            <span className="font-hanken text-2xl font-extrabold tracking-tight">
              Formly<span className="text-primary">.</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-ink-muted transition-colors hover:text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-ink-muted transition-colors hover:text-primary"
            >
              How it works
            </a>
            <a
              href="/surveys"
              className="text-sm font-medium text-ink-muted transition-colors hover:text-primary"
            >
              Available Surveys
            </a>
            <span className="h-5 w-px bg-border" />
            <a
              href="/signin"
              className="text-sm font-semibold text-ink transition-colors hover:text-primary"
            >
              Sign in
            </a>
            <a href="/signup" className="primary-button">
              Sign up <ArrowRight size={16} />
            </a>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <a
              href="/signin"
              className="text-sm font-semibold text-ink-muted transition-colors hover:text-primary"
            >
              Sign in
            </a>
            <a href="/signup" className="primary-button px-4">
              Sign up
            </a>
          </div>
        </nav>
      </header>

      <section className="relative bg-[#f4fbf4]">
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-[#d8f0df] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-64 h-72 w-72 rounded-full bg-[#e3f1e4] opacity-70 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c6ddcc] bg-white/80 px-4 py-2 text-sm font-medium text-secondary shadow-sm">
              <Sparkles size={16} className="text-primary" />
              A simpler way to collect feedback
            </div>

            <h1 className="max-w-3xl font-hanken text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Better questions.
              <br />
              <span className="text-primary">Better insights.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-ink-muted sm:text-lg">
              Create meaningful surveys, collect responses and understand what
              people think. Formly brings your feedback workflow together in one
              simple place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="/signup" className="primary-button min-h-12 px-6">
                Create your first survey
                <ArrowRight size={18} />
              </a>
              <a href="#features" className="secondary-button min-h-12 px-6">
                Discover features
                <ArrowDown size={16} />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-primary" />
                Easy to use
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-primary" />
                Flexible questions
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-primary" />
                Clear results
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -right-3 top-12 h-32 w-32 rounded-full bg-[#d8eadc] blur-2xl" />

            <div className="relative rounded-[28px] border border-[#d5e2d7] bg-white p-5 shadow-[0_24px_80px_rgba(29,65,44,0.10)] sm:p-7">
              <div className="flex items-center justify-between border-b border-[#e7eee8] pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4e9] text-primary">
                    <ClipboardCheck size={21} />
                  </span>
                  <div>
                    <p className="font-hanken text-lg font-bold">
                      Customer feedback
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      Survey preview
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[#e5f4e9] px-3 py-1.5 text-xs font-semibold text-primary">
                  Preview
                </span>
              </div>

              <div className="py-6">
                <p className="text-sm font-semibold">
                  How was your recent experience?
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Your feedback helps us improve our service.
                </p>

                <div className="mt-5 grid grid-cols-5 gap-2">
                  {["😞", "😕", "😐", "🙂", "😍"].map((emoji, index) => (
                    <div
                      key={emoji}
                      className={`flex h-14 items-center justify-center rounded-xl border text-2xl ${
                        index === 4
                          ? "border-primary bg-[#e7f5eb] ring-2 ring-[#c5e8d0]"
                          : "border-[#e0e9e1] bg-[#f8fbf8]"
                      }`}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-xl border border-[#e0e9e1] bg-[#f8fbf8] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Overall satisfaction
                    </span>
                    <span className="text-sm font-bold text-primary">
                      5 / 5
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dce8de]">
                    <div className="h-full w-full rounded-full bg-primary" />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-ink-muted">
                    Your response matters.
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <ShieldCheck size={15} />
                    Privacy matters
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-[#d5e2d7] bg-white p-4 shadow-lg sm:flex">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f4e9] text-primary">
                <BarChart3 size={22} />
              </span>
              <div>
                <p className="text-sm font-bold">Response insights</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Your feedback, organized
                </p>
              </div>
              <CheckCircle2 size={18} className="ml-2 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#f4fbf4] py-20 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Everything you need</SectionLabel>
            <h2 className="font-hanken text-4xl font-extrabold tracking-tight sm:text-5xl">
              From questions to <span className="text-primary">clarity.</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              Create surveys, hear from your audience and turn feedback into
              information you can use.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group rounded-2xl border border-[#e0e9e1] bg-[#f8fbf8] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#a9ccb3] hover:bg-white hover:shadow-[0_16px_40px_rgba(29,65,44,0.07)] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f4e9] text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Icon size={22} />
                    </span>
                    <span className="font-jetbrains text-xs text-[#89978d]">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-hanken text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">
                    {feature.description}
                  </p>

                  <a
                    href="/signup"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:translate-x-1"
                  >
                    Get started <ChevronRight size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-[#f4fbf4] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel>Simple by design</SectionLabel>
              <h2 className="font-hanken text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Three steps.
                <br />
                <span className="text-primary">Meaningful feedback.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
                Spend less time managing the process and more time learning
                from the people who matter.
              </p>
              <a href="/signup" className="primary-button mt-8">
                Get started <ArrowRight size={17} />
              </a>
            </div>

            <div className="space-y-4">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="flex gap-5 rounded-2xl border border-[#dbe7dc] bg-white p-5 sm:gap-6 sm:p-7"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5f4e9] font-jetbrains text-sm font-semibold text-primary">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-hanken text-xl font-bold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-ink-muted">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
