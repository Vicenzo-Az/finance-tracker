import type { TrendsData } from "@/types";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  trends: TrendsData;
}

function VariationBadge({ value }: { value: number | null }) {
  if (value === null)
    return <span className="text-xs text-muted-foreground">—</span>;

  const isPositive = value > 0;
  const isZero = value === 0;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={
        isZero
          ? {
              background:
                "color-mix(in srgb, var(--foreground) 8%, transparent)",
              color: "var(--text-muted)",
            }
          : isPositive
            ? { background: "rgba(76,138,106,0.12)", color: "#4C8A6A" }
            : { background: "rgba(201,74,63,0.12)", color: "#C94A3F" }
      }
    >
      {isZero ? (
        <Minus size={11} />
      ) : isPositive ? (
        <TrendingUp size={11} />
      ) : (
        <TrendingDown size={11} />
      )}
      {Math.abs(value)}%
    </span>
  );
}

export function TrendsCard({ trends }: Props) {
  const { current_month, previous_month, variation } = trends;

  const items = [
    {
      label: "Receitas",
      current: current_month.income,
      previous: previous_month.income,
      variation: variation.income,
      color: "#4C8A6A",
    },
    {
      label: "Despesas",
      current: current_month.expense,
      previous: previous_month.expense,
      variation: variation.expense,
      color: "#C94A3F",
    },
    {
      label: "Saldo",
      current: current_month.balance,
      previous: previous_month.balance,
      variation: variation.balance,
      color: "#C7A35A",
    },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          Comparativo Mensal
        </h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          vs. mês anterior
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {item.label}
            </p>
            <p
              className="text-xl font-bold font-display"
              style={{ color: item.color }}
            >
              R$ {item.current.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
              <VariationBadge value={item.variation} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                R$ {item.previous.toFixed(2)} antes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
