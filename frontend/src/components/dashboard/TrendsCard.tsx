import type { TrendsData } from "@/types";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  trends: TrendsData;
}

function VariationBadge({ value }: { value: number | null }) {
  if (value === null)
    return (
      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        —
      </span>
    );

  const isPositive = value > 0;
  const isZero = value === 0;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={
        isZero
          ? {
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.4)",
            }
          : isPositive
            ? { background: "rgba(76,138,106,0.12)", color: "#8FC4A6" }
            : { background: "rgba(201,74,63,0.12)", color: "#D98B7E" }
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
      color: "#8FC4A6",
    },
    {
      label: "Despesas",
      current: current_month.expense,
      previous: previous_month.expense,
      variation: variation.expense,
      color: "#D98B7E",
    },
    {
      label: "Saldo",
      current: current_month.balance,
      previous: previous_month.balance,
      variation: variation.balance,
      color: "#D9B36A", // gold — saldo como indicador de patrimônio
    },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "#121814",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-sm font-semibold"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Comparativo Mensal
        </h3>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          vs. mês anterior
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <p
              className="text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.35)" }}
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
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                R$ {item.previous.toFixed(2)} antes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
