import type { MonthlyData } from "@/types";
import { useTheme } from "next-themes";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: MonthlyData[];
}

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ name: string; value: number; color: string }>;
  label?: string | number;
  isDark: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  isDark,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[160px]"
      style={{
        background: isDark ? "#121814" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e8e1"}`,
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.2)",
      }}
    >
      <p
        className="text-xs mb-2 font-medium"
        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#6B7A70" }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-4 mb-1"
        >
          <span
            className="text-xs"
            style={{ color: isDark ? "rgba(255,255,255,0.45)" : "#4A5750" }}
          >
            {entry.name}
          </span>
          <span
            className="text-xs font-semibold font-display"
            style={{ color: entry.color }}
          >
            R$ {entry.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function MonthlyChart({ data }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const gridColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "rgba(255,255,255,0.35)" : "#6B7A70";
  const axisColorMuted = isDark ? "rgba(255,255,255,0.25)" : "#8A928B";
  const legendColor = isDark ? "rgba(255,255,255,0.45)" : "#4A5750";

  const chartData = data.map((d) => ({
    ...d,
    month: formatMonth(d.month),
  }));

  return (
    <div
      className="w-full rounded-2xl p-6"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-6"
        style={{ color: "var(--text-secondary)" }}
      >
        Evolução Mensal
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: axisColorMuted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} isDark={isDark} />}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: legendColor, fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Receitas"
              stroke="#4C8A6A"
              strokeWidth={2}
              dot={{ r: 3, fill: "#4C8A6A", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#8FC4A6", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Despesas"
              stroke="#C94A3F"
              strokeWidth={2}
              dot={{ r: 3, fill: "#C94A3F", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#D98B7E", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo"
              stroke="#C7A35A"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 3, fill: "#C7A35A", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#D9B36A", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
