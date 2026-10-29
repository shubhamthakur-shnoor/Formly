export function MetricCard({ title, value, description, icon: Icon }) {
  return (
    <article className="flex justify-between rounded-2xl border border-[#bbcabf] bg-white p-5">
      <div>
        <p className="text-sm text-[#3c4a42]">
          {title}
        </p>

        <p className="mt-3 font-hanken text-3xl font-bold">
          {value}
        </p>

        <p className="mt-2 text-xs text-[#3c4a42]">
          {description}
        </p>
      </div>
      {Icon && (
        <span className="h-fit rounded-xl bg-[#e5f5eb] p-3 text-[#006c49]">
          <Icon size={21} />
        </span>
      )}
    </article>
  );
}
export function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-[#bbcabf] bg-white p-5">
      <h2 className="font-hanken text-lg font-semibold">
        {title}
      </h2>

      <div className="mt-5 h-64">
        {children}
      </div>
    </section>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="flex h-full min-h-40 items-center justify-center px-4 text-center text-sm text-[#3c4a42]">
      {children}
    </div>
  );
}

export function SurveyStatusBadge({ status }) {
  const normalizedStatus = (status || "DRAFT").toUpperCase();

  const statusStyles = {
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    DRAFT: "bg-amber-100 text-amber-700",
    CLOSED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs ${
        statusStyles[normalizedStatus] || statusStyles.DRAFT
      }`}
    >
      {normalizedStatus}
    </span>
  );
}
