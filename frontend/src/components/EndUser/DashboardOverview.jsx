import { ClipboardList, FileCheck2, Clock3, ArrowRight } from "lucide-react";

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#dce7dd] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#718078]">{title}</p>
        <div className="rounded-xl bg-[#eaf4ec] p-2.5 text-[#006c49]">
          <Icon size={20} />
        </div>
      </div>

      <h3 className="mt-5 font-hanken text-3xl font-bold text-[#17251c]">
        {value}
      </h3>

      <p className="mt-2 text-xs text-[#718078]">{description}</p>
    </div>
  );
}

export default function DashboardOverview({
  availableCount = 0,
  submittedCount = 0,
  pendingCount = 0,
  onNavigate,
}) {
  const fullName = localStorage.getItem("full_name") || "there";

  return (
    <div className="space-y-7">
      <section>
        <h2 className="font-hanken text-2xl font-bold text-[#17251c]">
          Hello, {fullName.split(" ")[0]}!
        </h2>
        <p className="mt-2 text-sm text-[#718078]">
          Explore surveys, share your feedback and track your submissions.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Available Surveys"
          value={availableCount}
          description="Surveys available for participation"
          icon={ClipboardList}
        />

        <StatCard
          title="My Submissions"
          value={submittedCount}
          description="Surveys you have submitted"
          icon={FileCheck2}
        />

        <StatCard
          title="Pending Surveys"
          value={pendingCount}
          description="Surveys you haven't submitted yet"
          icon={Clock3}
        />
      </section>

      <section className="rounded-2xl bg-[#006c49] p-6 text-white sm:p-8">
        <div className="max-w-xl">
          <p className="font-jetbrains text-[10px] uppercase tracking-widest text-white/70">
            Your feedback matters
          </p>

          <h3 className="mt-3 font-hanken text-2xl font-bold">
            Make your voice count.
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/80">
            Discover available surveys and share your opinions to help
            organizations make better decisions.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("Available Surveys")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#006c49] transition hover:bg-[#eaf4ec]"
          >
            Explore Surveys
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
