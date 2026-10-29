import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,Cell } from "recharts";
import { ChartCard, EmptyState } from "./DashboardUI";
const COLORS = ["#006c49", "#0fb981", "#8abf9e"];
const getStatus = (survey) =>
  (survey.status || "DRAFT").toUpperCase();
const getResponses = (survey) =>
  Number(
    survey.response_count ??
      survey.responses_count ??
      survey.total_responses ??
      survey.responseCount ??
      0
  );
export default function AnalyticsSection({ surveys = [] }) {
  const responseData = surveys.slice(0, 7).map((survey) => ({
    name: (survey.title || survey.name || "Untitled").slice(0, 18),
    responses: getResponses(survey),
  }));
  const statusData = [
    {
      name: "Published",
      value: surveys.filter(
        (survey) => getStatus(survey) === "PUBLISHED"
      ).length,
    },
    {
      name: "Draft",
      value: surveys.filter(
        (survey) => getStatus(survey) === "DRAFT"
      ).length,
    },
    {
      name: "Closed",
      value: surveys.filter(
        (survey) => getStatus(survey) === "CLOSED"
      ).length,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="Responses by survey">
        {responseData.length === 0 ? (
          <EmptyState>No surveys available for analytics.</EmptyState>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={responseData}
              margin={{ top: 8, right: 8, left: -20, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#e4ece5"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={55}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="responses"
                name="Responses"
                fill="#006c49"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Survey status">
        {statusData.length === 0 ? (
          <EmptyState>
            Create a survey to see its status breakdown.
          </EmptyState>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={82}
                innerRadius={42}
                paddingAngle={3}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}