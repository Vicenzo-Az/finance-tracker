import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  income: number;
  expenses: number;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ value: number; payload: { name: string } }>;
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
  const isIncome = payload[0].payload.name === "Receita";
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: isDark ? "#121814" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e8e1"}`,
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.2)",
      }}
    >
      <p
        className="text-xs mb-1"
        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#6B7A70" }}
      >
        {label}
      </p>
      <p
        className="text-sm font-semibold font-display"
        style={{ color: isIncome ? "#4C8A6A" : "#C94A3F" }}
      >
        R$ {payload[0].value.toFixed(2)}
      </p>
    </div>
  );
};

export function IncomeExpenseChart({ income, expenses }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const gridColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "rgba(255,255,255,0.35)" : "#6B7A70";
  const axisColorMuted = isDark ? "rgba(255,255,255,0.25)" : "#8A928B";

  const data = [
    { name: "Receita", value: income },
    { name: "Despesas", value: expenses },
  ];

  return (
    <div
      className="h-80 w-full rounded-2xl p-6"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-6"
        style={{ color: "var(--text-secondary)" }}
      >
        Receita vs Despesas
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: axisColor, fontSize: 12 }}
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
            cursor={{
              fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            }}
            content={(props) => <CustomTooltip {...props} isDark={isDark} />}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            <Cell fill="#4C8A6A" fillOpacity={0.85} />
            <Cell fill="#C94A3F" fillOpacity={0.75} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
