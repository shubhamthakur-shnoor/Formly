export default function Skeleton() {
  return (
    <div className="min-w-0 animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-[#e5eee7]" />
        <div className="h-4 w-64 max-w-full rounded-md bg-[#edf3ee]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <div className="h-4 w-24 rounded bg-[#edf3ee]" />
            <div className="h-8 w-20 rounded bg-[#e5eee7]" />
            <div className="h-3 w-32 rounded bg-[#edf3ee]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="space-y-5 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <div className="h-5 w-36 rounded bg-[#e5eee7]" />

            {Array.from({ length: 4 }).map((_, row) => (
              <div key={row} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#edf3ee]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-[#e5eee7]" />
                  <div className="h-3 w-1/2 rounded bg-[#edf3ee]" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
