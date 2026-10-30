import { ClipboardCheck } from "lucide-react";

export default function Loader({
  message = "Preparing your workspace...",
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#f4fbf4]">
      <div className="flex w-full max-w-xs flex-col items-center px-6">
        {/* Formly Logo */}
        <div className="mb-4 flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006c49] text-white shadow-lg shadow-[#006c49]/20">
            <ClipboardCheck size={26} strokeWidth={2.2} />
          </div>

          <h1 className="font-hanken text-3xl font-bold tracking-tight text-[#161d19]">
            Formly
          </h1>
        </div>

        {/* Loading line */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#dce9df]">
          <div className="formly-loading-bar h-full w-2/5 rounded-full bg-[#006c49]" />
        </div>

        {/* Loading message */}
        <p className="mt-4 text-sm font-medium text-[#718078] animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}