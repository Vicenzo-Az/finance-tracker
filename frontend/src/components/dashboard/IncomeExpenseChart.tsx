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
  payload?: Array<{ value: number; payload: { name: string } }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const isIncome = payload[0].payload.name === "Receita";
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "#121814",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
      }}
    >
      <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </p>
      <p
        className="text-sm font-semibold font-display"
        style={{ color: isIncome ? "#8FC4A6" : "#D98B7E" }}
      >
        R$ {payload[0].value.toFixed(2)}
      </p>
    </div>
  );
};

export function IncomeExpenseChart({ income, expenses }: Props) {
  const data = [
    { name: "Receita", value: income },
    { name: "Despesas", value: expenses },
  ];

  return (
    <div
      className="h-80 w-full rounded-2xl p-6"
      style={{
        background: "#121814",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-6"
        style={{ color: "rgba(255,255,255,0.7)" }}
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
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            content={<CustomTooltip />}
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
