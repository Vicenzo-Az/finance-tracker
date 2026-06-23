import type { MonthlyData } from "@/types";
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
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[160px]"
      style={{
        background: "#121814",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
      }}
    >
      <p
        className="text-xs mb-2 font-medium"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-4 mb-1"
        >
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
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
  const chartData = data.map((d) => ({
    ...d,
    month: formatMonth(d.month),
  }));

  return (
    <div
      className="w-full rounded-2xl p-6"
      style={{
        background: "#121814",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-6"
        style={{ color: "rgba(255,255,255,0.7)" }}
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
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
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
            {/* Saldo em dourado — gold finalmente na linha do patrimônio */}
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
