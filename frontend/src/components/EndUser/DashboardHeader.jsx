import { Menu, LayoutDashboard } from "lucide-react";

export default function DashboardHeader({
  activePage,
  onMenuClick,
}) {
  const fullName = localStorage.getItem("full_name") || "User";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e3ebe4] bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-[#526158] transition hover:bg-[#f1f6f1] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate font-hanken text-xl font-bold text-[#17251c]">
            {activePage}
          </h1>

          <p className="mt-0.5 hidden text-xs text-[#829087] sm:block">
            Welcome back, {fullName}
          </p>
        </div>
      </div>

      {/* Right - Workspace indicator, no user profile */}
      <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#e0ebe2] bg-[#f7faf7] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#15945f]" />

        <span className="hidden text-xs font-medium text-[#526158] sm:block">
          Respondent Workspace
        </span>

        <LayoutDashboard
          size={16}
          className="text-[#006c49] sm:hidden"
        />
      </div>
    </header>
  );
}