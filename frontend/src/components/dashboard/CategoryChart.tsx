import type { CategoryData } from "@/types";
import { useTheme } from "next-themes";
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
  payload?: ReadonlyArray<{
    name: string;
    value: number;
    payload: { category_color: string };
  }>;
  isDark: boolean;
}

const CustomTooltip = ({ active, payload, isDark }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: isDark ? "#121814" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e8e1"}`,
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: item.payload.category_color }}
        />
        <p
          className="text-xs"
          style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#6B7A70" }}
        >
          {item.name}
        </p>
      </div>
      <p
        className="text-sm font-semibold font-display"
        style={{ color: "#C7A35A" }}
      >
        R$ {item.value.toFixed(2)}
      </p>
    </div>
  );
};

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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const legendColor = isDark ? "rgba(255,255,255,0.5)" : "#4A5750";

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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
