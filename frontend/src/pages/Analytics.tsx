import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import {
  compareMonths,
  getByCategory,
  getFutureCommitments,
  getMonthly,
  getMonthlyDetail,
  getRecurringAverage,
  getSummary,
  type CompareMonthsData,
  type FutureCommitmentsData,
  type MonthlyDetailData,
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

const currentYear = new Date().getFullYear();
const currentMonthStr = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
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
          ? { background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }
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

const cardStyle = {
  background: "var(--surface-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "1rem",
};

const mutedText = { color: "var(--text-muted)" };
const sectionTitleStyle = { color: "var(--text-secondary)" };
const thStyle = "text-left px-6 py-3 text-xs font-medium";
const thStyleRight = "text-right px-6 py-3 text-xs font-medium";

// ─── ABA: VISÃO GERAL ────────────────────────────────────────────────────────
function OverviewTab() {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [expenseByCategory, setExpenseByCategory] = useState<CategoryData[]>(
    [],
  );
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
  const [recurring, setRecurring] = useState<RecurringAverageData | null>(null);
  const [futureCommitments, setFutureCommitments] =
    useState<FutureCommitmentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [s, m, ec, ic, r, fc] = await Promise.all([
          getSummary(),
          getMonthly(selectedYear),
          getByCategory("expense", selectedYear),
          getByCategory("income", selectedYear),
          getRecurringAverage(selectedYear),
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

  const years = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => currentYear - i,
  );

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "#7DB99A" }}
        />
      </div>
    );

  return (
    <div className="space-y-10">
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
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderLeft: `3px solid ${item.accent}`,
            }}
          >
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

      {/* Seletor de ano */}
      <div className="flex items-center gap-3">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="text-sm rounded-xl px-3 h-9 outline-none"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {monthly.length > 0 ? (
        <MonthlyChart data={monthly} />
      ) : (
        <div
          className="p-8 text-center rounded-2xl text-sm"
          style={{ ...cardStyle, color: "var(--text-muted)" }}
        >
          Sem dados mensais para {selectedYear}
        </div>
      )}

      {/* Distribuição por categoria */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={sectionTitleStyle}>
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
              style={{ ...cardStyle, color: "var(--text-muted)" }}
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
              style={{ ...cardStyle, color: "var(--text-muted)" }}
            >
              Sem receitas registradas
            </div>
          )}
        </div>
      </div>

      {/* Ranking de despesas */}
      {expenseByCategory.length > 0 && (
        <div>
          <h2
            className="text-base font-semibold mb-4"
            style={sectionTitleStyle}
          >
            Ranking de Despesas
          </h2>
          <div style={cardStyle}>
            <table className="w-full text-sm hidden md:table">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
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
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
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
                            style={{ color: "var(--text-secondary)" }}
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
                            style={{ background: "var(--border-subtle)" }}
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
              style={{ borderColor: "var(--border-subtle)" }}
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
                      style={{ color: "var(--text-secondary)" }}
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
        <h2 className="text-base font-semibold mb-4" style={sectionTitleStyle}>
          Despesas Recorrentes
        </h2>
        {!recurring || recurring.by_category.length === 0 ? (
          <div
            className="p-8 text-center rounded-2xl text-sm"
            style={{ ...cardStyle, color: "var(--text-muted)" }}
          >
            Nenhuma despesa marcada como recorrente.
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
                  color: "var(--text-primary)",
                },
                {
                  label: "Meses com recorrentes",
                  value: String(recurring.n_months),
                  color: "var(--text-primary)",
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
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
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
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: cat.category_color }}
                          />
                          <span style={{ color: "var(--text-secondary)" }}>
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
        <h2 className="text-base font-semibold mb-4" style={sectionTitleStyle}>
          Compromissos Futuros
        </h2>
        {!futureCommitments || futureCommitments.total_pending === 0 ? (
          <div
            className="p-8 text-center rounded-2xl text-sm"
            style={{ ...cardStyle, color: "var(--text-muted)" }}
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
                  style={{ color: "var(--text-primary)" }}
                >
                  {futureCommitments.by_group.length}
                </p>
              </div>
            </div>
            <div style={cardStyle}>
              <table className="w-full text-sm hidden md:table">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
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
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <td
                        className="px-6 py-3 font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {group.description}
                      </td>
                      <td className="px-6 py-3 text-right" style={mutedText}>
                        {group.remaining_installments}/{group.installment_total}
                      </td>
                      <td
                        className="px-6 py-3 text-right"
                        style={{ color: "var(--text-secondary)" }}
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
                style={{ borderColor: "var(--border-subtle)" }}
              >
                {futureCommitments.by_group.map((group) => (
                  <div
                    key={group.installment_group_id}
                    className="px-4 py-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
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
    </div>
  );
}

// ─── ABA: POR MÊS ────────────────────────────────────────────────────────────
function MonthTab() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [detail, setDetail] = useState<MonthlyDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [compareA, setCompareA] = useState(currentMonthStr);
  const [compareB, setCompareB] = useState(() => {
    const prev = new Date(new Date().setMonth(new Date().getMonth() - 1));
    return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
  });
  const [compareData, setCompareData] = useState<CompareMonthsData | null>(
    null,
  );
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getMonthlyDetail(selectedMonth);
        setDetail(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedMonth]);

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

  return (
    <div className="space-y-10">
      {/* Seletor mês + ano */}
      <div className="flex items-center gap-2">
        <select
          value={selectedMonth.split("-")[0]}
          onChange={(e) => {
            const m = selectedMonth.split("-")[1];
            setSelectedMonth(`${e.target.value}-${m}`);
          }}
          className="text-sm rounded-xl px-3 h-9 outline-none"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          {Array.from(
            { length: currentYear - 2023 + 1 },
            (_, i) => currentYear - i,
          ).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth.split("-")[1]}
          onChange={(e) => {
            const y = selectedMonth.split("-")[0];
            setSelectedMonth(`${y}-${e.target.value}`);
          }}
          className="text-sm rounded-xl px-3 h-9 outline-none"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          {[
            ["01", "Janeiro"],
            ["02", "Fevereiro"],
            ["03", "Março"],
            ["04", "Abril"],
            ["05", "Maio"],
            ["06", "Junho"],
            ["07", "Julho"],
            ["08", "Agosto"],
            ["09", "Setembro"],
            ["10", "Outubro"],
            ["11", "Novembro"],
            ["12", "Dezembro"],
          ].map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "#7DB99A" }}
          />
        </div>
      ) : !detail || detail.transaction_count === 0 ? (
        <div
          className="p-8 text-center rounded-2xl text-sm"
          style={{ ...cardStyle, color: "var(--text-muted)" }}
        >
          Nenhuma transação registrada em {formatMonth(selectedMonth)}.
        </div>
      ) : (
        <>
          {/* Cards do mês */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Receitas",
                value: detail.income,
                color: "#8FC4A6",
                accent: "#4C8A6A",
                variation: detail.variation.income,
              },
              {
                label: "Despesas",
                value: detail.expense,
                color: "#D98B7E",
                accent: "#C94A3F",
                variation: detail.variation.expense,
              },
              {
                label: "Saldo",
                value: detail.balance,
                color: "#D9B36A",
                accent: "#C7A35A",
                variation: detail.variation.balance,
              },
              {
                label: "Recorrentes",
                value: detail.recurring_total,
                color: "var(--text-secondary)",
                accent: "#8A928B",
                variation: null,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)",
                  borderLeft: `3px solid ${item.accent}`,
                }}
              >
                <p className="text-xs font-medium mb-1" style={mutedText}>
                  {item.label}
                </p>
                <p
                  className="text-xl font-bold font-display"
                  style={{ color: item.color }}
                >
                  R$ {item.value.toFixed(2)}
                </p>
                {item.variation !== null && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <VariationBadge value={item.variation} />
                    <span className="text-[10px]" style={mutedText}>
                      vs mês anterior
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Categorias do mês */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {detail.expense_by_category.length > 0 ? (
              <CategoryChart
                data={detail.expense_by_category}
                title="Despesas por Categoria"
              />
            ) : (
              <div
                className="p-8 text-center rounded-2xl text-sm"
                style={{ ...cardStyle, color: "var(--text-muted)" }}
              >
                Sem despesas categorizadas
              </div>
            )}
            {detail.income_by_category.length > 0 ? (
              <CategoryChart
                data={detail.income_by_category}
                title="Receitas por Categoria"
              />
            ) : (
              <div
                className="p-8 text-center rounded-2xl text-sm"
                style={{ ...cardStyle, color: "var(--text-muted)" }}
              >
                Sem receitas categorizadas
              </div>
            )}
          </div>

          {/* Ranking do mês */}
          {detail.expense_by_category.length > 0 && (
            <div>
              <h2
                className="text-base font-semibold mb-4"
                style={sectionTitleStyle}
              >
                Ranking de Despesas — {formatMonth(selectedMonth)}
              </h2>
              <div style={cardStyle}>
                <table className="w-full text-sm hidden md:table">
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
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
                        % do mês
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.expense_by_category.map((cat, index) => {
                      const total = detail.expense_by_category.reduce(
                        (acc, c) => acc + c.total,
                        0,
                      );
                      const pct =
                        total > 0
                          ? ((cat.total / total) * 100).toFixed(1)
                          : "0";
                      return (
                        <tr
                          key={cat.category_id}
                          style={{
                            borderBottom: "1px solid var(--border-subtle)",
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
                                style={{ color: "var(--text-secondary)" }}
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
                                style={{ background: "var(--border-subtle)" }}
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
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  {detail.expense_by_category.map((cat, index) => {
                    const total = detail.expense_by_category.reduce(
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
                          style={{ color: "var(--text-secondary)" }}
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
        </>
      )}

      {/* Comparar meses */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={sectionTitleStyle}>
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
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                />
              </div>
            ))}
            <button
              onClick={handleCompare}
              disabled={isLoadingCompare}
              className="flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium transition-all"
              style={{
                border: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
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

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Analytics() {
  const [activeTab, setActiveTab] = useState<"overview" | "month">("overview");

  const tabs = [
    { key: "overview" as const, label: "Visão Geral" },
    { key: "month" as const, label: "Por Mês" },
  ];

  return (
    <div className="space-y-8">
      {/* Header + Tabs */}
      <div>
        <h1
          className="text-2xl font-display font-semibold tracking-tight mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Análises
        </h1>
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === tab.key
                  ? { background: "#4C8A6A", color: "#090B0A" }
                  : { color: "var(--text-muted)" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" ? <OverviewTab /> : <MonthTab />}
    </div>
  );
}
