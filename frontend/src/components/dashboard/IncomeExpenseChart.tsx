import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Props = {
  income: number;
  expenses: number;
};

export function IncomeExpenseChart({ income, expenses }: Props) {
  const data = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];

  return (
    <div className="h-80 w-full rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-medium mb-6">Income vs Expenses</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#10b981",
            }}
            labelStyle={{ color: "#fff", fontWeight: "bold" }}
          />
          <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
