import {  Activity, BarChart3, ClipboardList, Download, LayoutDashboard, LogOut, Settings, X } from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Surveys", icon: ClipboardList },
  { label: "Analytics", icon: BarChart3 },
  { label: "Responses", icon: Activity },
  { label: "Exports", icon: Download },
];

export default function Sidebar({
  activePage,
  onNavigate,
  onLogout,
  mobileOpen,
  onClose,
}) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-[#bbcabf] bg-white transition-transform
          duration-200 lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-[#bbcabf] px-6">
          <div>
            <p className="font-hanken text-2xl font-bold text-[#006c49]">
              Formly
            </p>
            <p className="text-xs text-[#3c4a42]">Admin workspace</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 hover:bg-[#f4fbf4] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 font-jetbrains text-[10px] uppercase tracking-widest text-[#3c4a42]">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon }) => {
              const active = activePage === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    onNavigate(label);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-[#e5f5eb] text-[#006c49]"
                      : "text-[#3c4a42] hover:bg-[#f4fbf4]"
                  }`}
                >
                  <Icon size={19} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#bbcabf] p-4">
          <button
            type="button"
            onClick={() => {
              onNavigate("Settings");
              onClose();
            }}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
              activePage === "Settings"
                ? "bg-[#e5f5eb] text-[#006c49]"
                : "text-[#3c4a42] hover:bg-[#f4fbf4]"
            }`}
          >
            <Settings size={19} />
            Settings
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
