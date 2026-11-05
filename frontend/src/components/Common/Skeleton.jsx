function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#e5eee7] ${className}`}
    />
  );
}
// Admin Overview
function AdminSkeleton() {
  return (
    <div className="min-w-0 animate-pulse space-y-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-4 w-64 max-w-full bg-[#edf3ee]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <SkeletonBlock className="h-4 w-24 bg-[#edf3ee]" />
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-3 w-32 bg-[#edf3ee]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="space-y-5 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <SkeletonBlock className="h-5 w-36" />

            {Array.from({ length: 4 }).map((_, row) => (
              <div key={row} className="flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-lg bg-[#edf3ee]" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-3 w-3/4" />
                  <SkeletonBlock className="h-3 w-1/2 bg-[#edf3ee]" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin My Surveys
function AdminSurveysSkeleton() {
  return (
    <div className="min-w-0 space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-64 bg-[#edf3ee]" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-10 w-full sm:max-w-xs" />
        <SkeletonBlock className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-5 w-2/3" />
              <SkeletonBlock className="h-6 w-16 rounded-full" />
            </div>

            <SkeletonBlock className="h-3 w-full bg-[#edf3ee]" />
            <SkeletonBlock className="h-3 w-3/4 bg-[#edf3ee]" />

            <div className="flex justify-between border-t border-[#edf3ee] pt-4">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-16" />
            </div>

            <SkeletonBlock className="h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Analytics
function AdminAnalyticsSkeleton() {
  return (
    <div className="min-w-0 space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-64 bg-[#edf3ee]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <SkeletonBlock className="h-4 w-24 bg-[#edf3ee]" />
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-3 w-28 bg-[#edf3ee]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="space-y-5 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-64 w-full rounded-xl bg-[#edf3ee]" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#e4ece5] bg-white p-5">
        <SkeletonBlock className="mb-5 h-5 w-40" />
        <SkeletonBlock className="h-40 w-full rounded-xl bg-[#edf3ee]" />
      </div>
    </div>
  );
}

// Admin Responses
function AdminResponsesSkeleton() {
  return (
    <div className="min-w-0 space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-64 bg-[#edf3ee]" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-10 w-full sm:max-w-xs" />
        <SkeletonBlock className="h-10 w-36" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e4ece5] bg-white">
        <div className="flex gap-5 border-b border-[#e4ece5] p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock
              key={index}
              className="h-4 flex-1 bg-[#edf3ee]"
            />
          ))}
        </div>

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-5 border-b border-[#edf3ee] p-5 last:border-0"
          >
            {Array.from({ length: 5 }).map((_, cell) => (
              <SkeletonBlock key={cell} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Exports
function AdminExportsSkeleton() {
  return (
    <div className="min-w-0 space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-36" />
        <SkeletonBlock className="h-4 w-64 bg-[#edf3ee]" />
      </div>

      <div className="rounded-2xl border border-[#e4ece5] bg-white p-5 sm:p-6">
        <SkeletonBlock className="mb-5 h-5 w-40" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24 bg-[#edf3ee]" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>

          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24 bg-[#edf3ee]" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>
        </div>

        <SkeletonBlock className="mt-5 h-11 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-3 w-full bg-[#edf3ee]" />
            <SkeletonBlock className="h-3 w-2/3 bg-[#edf3ee]" />
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// End User Overview
function OverviewSkeleton() {
  return (
    <div className="min-w-0 space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-64 max-w-full bg-[#edf3ee]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <SkeletonBlock className="mb-4 h-10 w-10 rounded-xl" />
            <SkeletonBlock className="mb-3 h-4 w-28 bg-[#edf3ee]" />
            <SkeletonBlock className="mb-2 h-8 w-16" />
            <SkeletonBlock className="h-3 w-32 bg-[#edf3ee]" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#e4ece5] bg-white p-5">
        <SkeletonBlock className="mb-5 h-5 w-40" />

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <SkeletonBlock className="h-11 w-11 rounded-xl" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-3 w-1/2 bg-[#edf3ee]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Available Surveys
function AvailableSurveysSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-4 w-72 max-w-full bg-[#edf3ee]" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-10 w-full sm:max-w-xs" />
        <SkeletonBlock className="h-10 w-full sm:w-32" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <SkeletonBlock className="h-10 w-10 rounded-xl" />
              <SkeletonBlock className="h-6 w-20 rounded-full bg-[#edf3ee]" />
            </div>

            <SkeletonBlock className="mb-3 h-5 w-3/4" />
            <SkeletonBlock className="mb-2 h-3 w-full bg-[#edf3ee]" />
            <SkeletonBlock className="mb-5 h-3 w-2/3 bg-[#edf3ee]" />

            <div className="mt-auto space-y-3 border-t border-[#edf3ee] pt-4">
              <div className="flex justify-between">
                <SkeletonBlock className="h-3 w-24 bg-[#edf3ee]" />
                <SkeletonBlock className="h-3 w-20 bg-[#edf3ee]" />
              </div>
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// My Submissions
function MySubmissionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-4 w-72 max-w-full bg-[#edf3ee]" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-10 w-full sm:max-w-xs" />
        <SkeletonBlock className="h-10 w-full sm:w-32" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#e4ece5] bg-white p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SkeletonBlock className="h-12 w-12 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1 space-y-3">
                <SkeletonBlock className="h-5 w-2/3" />
                <div className="flex flex-wrap gap-3">
                  <SkeletonBlock className="h-3 w-28 bg-[#edf3ee]" />
                  <SkeletonBlock className="h-3 w-24 bg-[#edf3ee]" />
                </div>
              </div>

              <SkeletonBlock className="h-10 w-full rounded-xl sm:w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Submission Detail
function SubmissionDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
      </div>

      <div className="rounded-2xl border border-[#e4ece5] bg-white p-5">
        <SkeletonBlock className="mb-4 h-5 w-2/3" />
        <div className="flex flex-wrap gap-4">
          <SkeletonBlock className="h-3 w-28 bg-[#edf3ee]" />
          <SkeletonBlock className="h-3 w-28 bg-[#edf3ee]" />
        </div>
      </div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="space-y-4 rounded-2xl border border-[#e4ece5] bg-white p-5"
        >
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-11 w-full rounded-xl bg-[#edf3ee]" />

          {index % 2 === 0 && (
            <SkeletonBlock className="h-11 w-full rounded-xl bg-[#edf3ee]" />
          )}
        </div>
      ))}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-36" />
        <SkeletonBlock className="h-4 w-64 max-w-full bg-[#edf3ee]" />
      </div>

      <div className="rounded-2xl border border-[#e4ece5] bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <SkeletonBlock className="h-11 w-11 rounded-xl" />

          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-3 w-52 bg-[#edf3ee]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <SkeletonBlock className="h-3 w-24 bg-[#edf3ee]" />
              <SkeletonBlock className="h-11 w-full rounded-xl bg-[#edf3ee]" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <SkeletonBlock className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#e4ece5] bg-white p-5 sm:p-6">
        <SkeletonBlock className="mb-3 h-5 w-40" />
        <SkeletonBlock className="mb-6 h-3 w-64 max-w-full bg-[#edf3ee]" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <SkeletonBlock className="h-3 w-28 bg-[#edf3ee]" />
              <SkeletonBlock className="h-11 w-full rounded-xl bg-[#edf3ee]" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <SkeletonBlock className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Skeleton({ type = "admin" }) {
  switch (type) {
    // Admin
    case "admin":
      return <AdminSkeleton />;

    case "admin-surveys":
      return <AdminSurveysSkeleton />;

    case "admin-analytics":
      return <AdminAnalyticsSkeleton />;

    case "admin-responses":
      return <AdminResponsesSkeleton />;

    case "admin-exports":
      return <AdminExportsSkeleton />;

    case "admin-settings":
      return <SettingsSkeleton />;

    // End User
    case "overview":
      return <OverviewSkeleton />;

    case "available-surveys":
      return <AvailableSurveysSkeleton />;

    case "my-submissions":
      return <MySubmissionsSkeleton />;

    case "submission-detail":
      return <SubmissionDetailSkeleton />;

    case "settings":
      return <SettingsSkeleton />;

    default:
      return <AdminSkeleton />;
  }
}
