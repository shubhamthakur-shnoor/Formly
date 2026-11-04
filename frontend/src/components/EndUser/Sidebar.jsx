import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, ClipboardList, FileCheck2, LogOut, X, ChevronRight, ChevronUp, Settings } from "lucide-react";

const navigationItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Available Surveys", icon: ClipboardList },
  { label: "My Submissions", icon: FileCheck2 },
];

export default function Sidebar({
  activePage,
  onNavigate,
  onLogout,
  mobileOpen,
  onClose,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const fullName = localStorage.getItem("full_name") || "User";
  const email = localStorage.getItem("email") || "";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleNavigate = (page) => {
    setProfileMenuOpen(false);
    onNavigate(page);
    onClose?.();
  };

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setProfileMenuOpen(false);
    onLogout();
    onClose?.();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-[#10251a]/45 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-[#e3ebe4] bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#edf1ed] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006c49] text-white shadow-sm">
              <ClipboardList size={21} strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="font-hanken text-[23px] font-bold tracking-tight text-[#17251c]">
                Formly
              </h2>
              <p className="-mt-1 text-[10px] font-medium tracking-wide text-[#829087]">
                FEEDBACK PLATFORM
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-[#718078] transition hover:bg-[#f2f6f2] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-5 py-7">
          <p className="mb-4 px-3 font-jetbrains text-[10px] font-semibold uppercase tracking-[0.15em] text-[#91a096]">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navigationItems.map(({ label, icon: Icon }) => {
              const isActive = activePage === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleNavigate(label)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#eaf4ec] text-[#006c49] shadow-sm"
                      : "text-[#64736a] hover:bg-[#f4f8f4] hover:text-[#006c49]"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.3 : 1.8}
                    className={
                      isActive
                        ? "text-[#006c49]"
                        : "text-[#8a9990] group-hover:text-[#006c49]"
                    }
                  />

                  <span className="flex-1">{label}</span>

                  {isActive && (
                    <ChevronRight size={16} className="text-[#006c49]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Dropdown */}
        <div
          ref={profileMenuRef}
          className="relative shrink-0 border-t border-[#edf1ed] p-4"
        >
          {/* Dropdown opens above profile */}
          {profileMenuOpen && (
            <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 z-50 mb-2 overflow-hidden rounded-xl border border-[#e3ebe4] bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <button
                type="button"
                onClick={() => handleNavigate("Settings")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  activePage === "Settings"
                    ? "bg-[#eaf4ec] text-[#006c49]"
                    : "text-[#3c4a42] hover:bg-[#f4f8f4]"
                }`}
              >
                <Settings size={18} />
                Settings
              </button>

              <div className="my-1 border-t border-[#edf1ed]" />

              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}

          {/* Clickable Profile */}
          <button
            type="button"
            onClick={() => setProfileMenuOpen((previous) => !previous)}
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition ${
              profileMenuOpen
                ? "bg-[#f4f8f4]"
                : "hover:bg-[#f7faf7]"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d6e9da] bg-[#eaf4ec] text-sm font-bold text-[#006c49]">
              {initials || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[#25372b]">
                {fullName}
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-[#829087]">
                End User
              </p>

              {email && (
                <p className="mt-0.5 truncate text-[10px] text-[#9aa69e]">
                  {email}
                </p>
              )}
            </div>

            <ChevronUp
              size={18}
              className={`shrink-0 text-[#829087] transition-transform duration-200 ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
