import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import {
  compareMonths,
  getByCategory,
  getFutureCommitments,
  getMonthly,
  getRecurringAverage,
  getSummary,
  type CompareMonthsData,
  type FutureCommitmentsData,
  type RecurringAverageData,
} from "@/services/analyticsService";
import type { AnalyticsSummary, CategoryData, MonthlyData } from "@/types";
import {
  Loader2,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function VariationBadge({ value }: { value: number | null }) {
  if (value === null)
    return (
      <span
        className="text-xs font-medium"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
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

const cardStyle = {
  background: "#121814",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "1rem",
};

const sectionTitle = "text-base font-semibold mb-4";
const sectionTitleStyle = { color: "rgba(255,255,255,0.75)" };
const mutedText = { color: "rgba(255,255,255,0.35)" };
const thStyle = "text-left px-6 py-3 text-xs font-medium";
const thStyleRight = "text-right px-6 py-3 text-xs font-medium";

export default function Analytics() {
  const currentYear = new Date().getFullYear();
  const currentMonth = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [compareA, setCompareA] = useState(currentMonth);
  const [compareB, setCompareB] = useState(prevMonthStr);
  const [compareData, setCompareData] = useState<CompareMonthsData | null>(
    null,
  );
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [expenseByCategory, setExpenseByCategory] = useState<CategoryData[]>(
    [],
  );
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
  const [recurring, setRecurring] = useState<RecurringAverageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [futureCommitments, setFutureCommitments] =
    useState<FutureCommitmentsData | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [s, m, ec, ic, r, fc] = await Promise.all([
          getSummary(),
          getMonthly(selectedYear),
          getByCategory("expense"),
          getByCategory("income"),
          getRecurringAverage(),
          getFutureCommitments(),
        ]);
        setSummary(s);
        setMonthly(m);
        setExpenseByCategory(ec);
        setIncomeByCategory(ic);
        setRecurring(r);
        setFutureCommitments(fc);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedYear]);

  async function handleCompare() {
    if (!compareA || !compareB) return;
    setIsLoadingCompare(true);
    try {
      const data = await compareMonths(compareA, compareB);
      setCompareData(data);
    } finally {
      setIsLoadingCompare(false);
    }
  }

  const years = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => currentYear - i,
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "#7DB99A" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-display font-semibold tracking-tight"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          Análises
        </h1>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="text-sm rounded-xl px-3 h-9 outline-none"
          style={{
            background: "#121814",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Patrimônio Total",
            value: summary?.net_worth ?? 0,
            color: "#8FC4A6",
            accent: "rgba(76,138,106,0.5)",
          },
          {
            label: "Total Receitas",
            value: summary?.income ?? 0,
            color: "#8FC4A6",
            accent: "rgba(76,138,106,0.4)",
          },
          {
            label: "Total Despesas",
            value: summary?.expense ?? 0,
            color: "#D98B7E",
            accent: "rgba(201,74,63,0.45)",
          },
          {
            label: "Saldo Líquido",
            value: summary?.balance ?? 0,
            color: "#D9B36A",
            accent: "rgba(199,163,90,0.45)",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-2xl p-5 pt-6"
            style={{
              background: "#121814",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background: item.accent }}
            />
            <p className="text-xs font-medium mb-2" style={mutedText}>
              {item.label}
            </p>
            <p
              className="text-xl font-bold font-display"
              style={{ color: item.color }}
            >
              R$ {item.value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Evolução mensal */}
      {monthly.length > 0 ? (
        <MonthlyChart data={monthly} />
      ) : (
        <div
          className="p-8 text-center rounded-2xl text-sm"
          style={{ ...cardStyle, color: "rgba(255,255,255,0.35)" }}
        >
          Sem dados mensais para {selectedYear}
        </div>
      )}

      {/* Distribuição por categoria */}
      <div>
        <h2 className={sectionTitle} style={sectionTitleStyle}>
          Distribuição por Categoria
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {expenseByCategory.length > 0 ? (
            <CategoryChart
              data={expenseByCategory}
              title="Despesas por Categoria"
            />
          ) : (
            <div
              className="p-8 text-center rounded-2xl text-sm"
              style={{ ...cardStyle, color: "rgba(255,255,255,0.35)" }}
            >
              Sem despesas registradas
            </div>
          )}
          {incomeByCategory.length > 0 ? (
            <CategoryChart
              data={incomeByCategory}
              title="Receitas por Categoria"
            />
          ) : (
            <div
              className="p-8 text-center rounded-2xl text-sm"
              style={{ ...cardStyle, color: "rgba(255,255,255,0.35)" }}
            >
              Sem receitas registradas
            </div>
          )}
        </div>
      </div>

      {/* Ranking de despesas */}
      {expenseByCategory.length > 0 && (
        <div>
          <h2 className={sectionTitle} style={sectionTitleStyle}>
            Ranking de Despesas
          </h2>
          <div style={cardStyle}>
            <table className="w-full text-sm hidden md:table">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <th className={thStyle} style={mutedText}>
                    #
                  </th>
                  <th className={thStyle} style={mutedText}>
                    Categoria
                  </th>
                  <th className={thStyleRight} style={mutedText}>
                    Total
                  </th>
                  <th className={thStyleRight} style={mutedText}>
                    % do total
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenseByCategory.map((cat, index) => {
                  const total = expenseByCategory.reduce(
                    (acc, c) => acc + c.total,
                    0,
                  );
                  const pct =
                    total > 0 ? ((cat.total / total) * 100).toFixed(1) : "0";
                  return (
                    <tr
                      key={cat.category_id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td className="px-6 py-3 text-sm" style={mutedText}>
                        {index + 1}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: cat.category_color }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                          >
                            {cat.category_name}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-3 text-right text-sm font-medium"
                        style={{ color: "#D98B7E" }}
                      >
                        R$ {cat.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div
                            className="w-16 h-1.5 rounded-full overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: "#C94A3F",
                                opacity: 0.7,
                              }}
                            />
                          </div>
                          <span
                            className="text-xs w-10 text-right"
                            style={mutedText}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              className="md:hidden divide-y"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              {expenseByCategory.map((cat, index) => {
                const total = expenseByCategory.reduce(
                  (acc, c) => acc + c.total,
                  0,
                );
                const pct =
                  total > 0 ? ((cat.total / total) * 100).toFixed(1) : "0";
                return (
                  <div
                    key={cat.category_id}
                    className="px-4 py-3 flex items-center gap-3"
                  >
                    <span className="text-xs w-4" style={mutedText}>
                      {index + 1}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: cat.category_color }}
                    />
                    <span
                      className="flex-1 text-sm"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {cat.category_name}
                    </span>
                    <div className="text-right">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#D98B7E" }}
                      >
                        R$ {cat.total.toFixed(2)}
                      </p>
                      <p className="text-xs" style={mutedText}>
                        {pct}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Despesas recorrentes */}
      <div>
        <h2 className={sectionTitle} style={sectionTitleStyle}>
          Despesas Recorrentes
        </h2>
        {!recurring || recurring.by_category.length === 0 ? (
          <div
            className="p-8 text-center rounded-2xl text-sm"
            style={{ ...cardStyle, color: "rgba(255,255,255,0.35)" }}
          >
            Nenhuma despesa marcada como recorrente ainda.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: "Média mensal total",
                  value: `R$ ${recurring.average_monthly.toFixed(2)}`,
                  color: "#D98B7E",
                },
                {
                  label: "Total registrado",
                  value: `R$ ${recurring.total_recurring.toFixed(2)}`,
                  color: "rgba(255,255,255,0.8)",
                },
                {
                  label: "Meses com recorrentes",
                  value: String(recurring.n_months),
                  color: "rgba(255,255,255,0.8)",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-5"
                  style={cardStyle}
                >
                  <p className="text-xs mb-1 font-medium" style={mutedText}>
                    {item.label}
                  </p>
                  <p
                    className="text-xl font-bold font-display"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div style={cardStyle}>
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <th className={thStyle} style={mutedText}>
                      Categoria
                    </th>
                    <th className={thStyleRight} style={mutedText}>
                      Total
                    </th>
                    <th className={thStyleRight} style={mutedText}>
                      Média/mês
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recurring.by_category.map((cat) => (
                    <tr
                      key={cat.category_id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: cat.category_color }}
                          />
                          <span style={{ color: "rgba(255,255,255,0.75)" }}>
                            {cat.category_name}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-3 text-right font-medium"
                        style={{ color: "#D98B7E" }}
                      >
                        R$ {cat.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right" style={mutedText}>
                        R$ {cat.monthly_average.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Compromissos futuros */}
      <div>
        <h2 className={sectionTitle} style={sectionTitleStyle}>
          Compromissos Futuros
        </h2>
        {!futureCommitments || futureCommitments.total_pending === 0 ? (
          <div
            className="p-8 text-center rounded-2xl text-sm"
            style={{ ...cardStyle, color: "rgba(255,255,255,0.35)" }}
          >
            Nenhuma parcela pendente.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="text-xs mb-1 font-medium" style={mutedText}>
                  Total pendente
                </p>
                <p
                  className="text-xl font-bold font-display"
                  style={{ color: "#D9B36A" }}
                >
                  R$ {futureCommitments.total_pending.toFixed(2)}
                </p>
              </div>
              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="text-xs mb-1 font-medium" style={mutedText}>
                  Compras parceladas ativas
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {futureCommitments.by_group.length}
                </p>
              </div>
            </div>
            <div style={cardStyle}>
              <table className="w-full text-sm hidden md:table">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <th className={thStyle} style={mutedText}>
                      Descrição
                    </th>
                    <th className={thStyleRight} style={mutedText}>
                      Parcelas restantes
                    </th>
                    <th className={thStyleRight} style={mutedText}>
                      Valor/parcela
                    </th>
                    <th className={thStyleRight} style={mutedText}>
                      Total restante
                    </th>
                    <th className={thStyleRight} style={mutedText}>
                      Próximo venc.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {futureCommitments.by_group.map((group) => (
                    <tr
                      key={group.installment_group_id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td
                        className="px-6 py-3 font-medium"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        {group.description}
                      </td>
                      <td className="px-6 py-3 text-right" style={mutedText}>
                        {group.remaining_installments}/{group.installment_total}
                      </td>
                      <td
                        className="px-6 py-3 text-right"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        R$ {group.installment_amount.toFixed(2)}
                      </td>
                      <td
                        className="px-6 py-3 text-right font-medium"
                        style={{ color: "#D9B36A" }}
                      >
                        R$ {group.remaining_total.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right" style={mutedText}>
                        {new Date(
                          group.next_due + "T00:00:00",
                        ).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                className="md:hidden divide-y"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                {futureCommitments.by_group.map((group) => (
                  <div
                    key={group.installment_group_id}
                    className="px-4 py-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        {group.description}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#D9B36A" }}
                      >
                        R$ {group.remaining_total.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className="flex items-center justify-between text-xs"
                      style={mutedText}
                    >
                      <span>
                        {group.remaining_installments}/{group.installment_total}{" "}
                        parcelas · R$ {group.installment_amount.toFixed(2)}/mês
                      </span>
                      <span>
                        Venc.{" "}
                        {new Date(
                          group.next_due + "T00:00:00",
                        ).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparar meses */}
      <div>
        <h2 className={sectionTitle} style={sectionTitleStyle}>
          Comparar Meses
        </h2>
        <div className="rounded-2xl p-6" style={cardStyle}>
          <div className="flex items-end gap-3 flex-wrap mb-6">
            {[
              { label: "Mês A", value: compareA, set: setCompareA },
              { label: "Mês B", value: compareB, set: setCompareB },
            ].map((f) => (
              <div key={f.label} className="space-y-1">
                <label className="text-xs font-medium" style={mutedText}>
                  {f.label}
                </label>
                <input
                  type="month"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="text-sm rounded-xl px-3 h-9 outline-none block"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                />
              </div>
            ))}
            <button
              onClick={handleCompare}
              disabled={isLoadingCompare}
              className="flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium transition-all"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {isLoadingCompare ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Comparar
            </button>
          </div>

          {compareData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Receitas", key: "income" as const, color: "#8FC4A6" },
                {
                  label: "Despesas",
                  key: "expense" as const,
                  color: "#D98B7E",
                },
                { label: "Saldo", key: "balance" as const, color: "#D9B36A" },
              ].map(({ label, key, color }) => (
                <div key={key} className="space-y-3">
                  <p className="text-sm font-medium" style={mutedText}>
                    {label}
                  </p>
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className="text-xs mb-0.5 capitalize"
                        style={mutedText}
                      >
                        {formatMonth(compareA)}
                      </p>
                      <p
                        className="text-lg font-bold font-display"
                        style={{ color }}
                      >
                        R$ {compareData.month_a[key].toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xs mb-0.5 capitalize"
                        style={mutedText}
                      >
                        {formatMonth(compareB)}
                      </p>
                      <p
                        className="text-lg font-bold font-display"
                        style={{ color }}
                      >
                        R$ {compareData.month_b[key].toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <VariationBadge value={compareData.variation[key]} />
                    <span className="text-xs" style={mutedText}>
                      vs mês B
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
