import { Menu, RefreshCw } from "lucide-react";
export default function DashboardHeader({
  activePage,
  onMenuClick,
  onRefresh,
  loading,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#bbcabf] bg-white/95 px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-[#f4fbf4] lg:hidden"
        >
          <Menu size={21} />
        </button>
        <h1 className="font-hanken text-xl font-bold sm:text-2xl">
          {activePage}
        </h1>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        aria-label="Refresh surveys"
        title="Refresh surveys"
        className="rounded-xl border border-[#bbcabf] p-2.5 text-[#376850] hover:bg-[#f4fbf4] disabled:opacity-50"
      >
        <RefreshCw
          size={18}
          className={loading ? "animate-spin" : ""}
        />
      </button>
    </header>
  );
}
