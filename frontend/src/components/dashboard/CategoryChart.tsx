import type { CategoryData } from "@/types";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  data: CategoryData[];
  title?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { category_color: string };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "#121814",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: item.payload.category_color }}
        />
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {item.name}
        </p>
      </div>
      <p
        className="text-sm font-semibold font-display"
        style={{ color: "#D9B36A" }}
      >
        R$ {item.value.toFixed(2)}
      </p>
    </div>
  );
};

// Paleta que harmoniza com o design system quando as categorias não têm cor própria
const FALLBACK_COLORS = [
  "#4C8A6A",
  "#C7A35A",
  "#3B9B95",
  "#78A88A",
  "#8A6A2F",
  "#D9B36A",
  "#2D6A4F",
  "#A7C4B0",
];

export function CategoryChart({
  data,
  title = "Despesas por Categoria",
}: Props) {
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
        {title}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category_name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.category_color ||
                    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                  }
                  fillOpacity={0.85}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
