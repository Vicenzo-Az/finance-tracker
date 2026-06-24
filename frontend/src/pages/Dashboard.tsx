import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { TrendsCard } from "@/components/dashboard/TrendsCard";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/context";
import { getAccounts } from "@/services/accountService";
import {
  getByCategory,
  getMonthly,
  getSummary,
  getTrends,
} from "@/services/analyticsService";
import type {
  Account,
  AnalyticsSummary,
  CategoryData,
  MonthlyData,
  TrendsData,
} from "@/types";
import { Loader2, PlusCircle, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [byCategory, setByCategory] = useState<CategoryData[]>([]);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [s, m, c, t] = await Promise.all([
          getSummary(),
          getMonthly(),
          getByCategory("expense"),
          getTrends(),
        ]);
        setSummary(s);
        setMonthly(m);
        setByCategory(c);
        setTrends(t);
      } catch {
        // silencia erros de carregamento
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [transactions]);

  const recentTransactions = [...transactions]
    .filter((t) => t.type !== "transfer")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const hasNoAccounts = accounts.length === 0;
  const isEmpty =
    transactions.filter((t) => t.type !== "transfer").length === 0;

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
    <div className="space-y-8">
      {/* Título */}
      <div>
        <h1
          className="text-2xl font-display font-semibold tracking-tight leading-none mb-6"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          Visão Geral
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Patrimônio Total"
            value={`R$ ${(summary?.net_worth ?? 0).toFixed(2)}`}
            variant="highlight"
          />
          <StatCard
            title="Receitas"
            value={`R$ ${(summary?.income ?? 0).toFixed(2)}`}
            variant="income"
          />
          <StatCard
            title="Despesas"
            value={`R$ ${(summary?.expense ?? 0).toFixed(2)}`}
            variant="expense"
          />
          <StatCard
            title="Saldo"
            value={`R$ ${(summary?.balance ?? 0).toFixed(2)}`}
            variant="balance"
          />
        </div>
      </div>

      {/* Banner onboarding */}
      {hasNoAccounts && (
        <div
          className="flex items-center justify-between gap-4 rounded-2xl p-4"
          style={{
            background: "rgba(199,163,90,0.06)",
            border: "1px solid rgba(199,163,90,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <Wallet
              size={18}
              style={{ color: "#D9B36A" }}
              className="shrink-0"
            />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              <span className="font-medium" style={{ color: "#D9B36A" }}>
                Crie uma conta financeira
              </span>{" "}
              para vincular transações e ver seu patrimônio real.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate("/accounts")}
            className="shrink-0 text-xs"
            style={{
              background: "rgba(199,163,90,0.12)",
              border: "1px solid rgba(199,163,90,0.3)",
              color: "#D9B36A",
            }}
          >
            Criar conta
          </Button>
        </div>
      )}

      {isEmpty ? (
        <div
          className="p-12 text-center rounded-2xl"
          style={{
            background: "#121814",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <h3
                className="text-lg font-semibold"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Nenhuma transação ainda
              </h3>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Comece adicionando sua primeira receita ou despesa.
              </p>
            </div>
            <button
              onClick={() => navigate("/transactions")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "#4C8A6A", color: "#090B0A" }}
            >
              <PlusCircle size={16} />
              Adicionar Transação
            </button>
          </div>
        </div>
      ) : (
        <>
          {trends && <TrendsCard trends={trends} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <IncomeExpenseChart
              income={summary?.income ?? 0}
              expenses={summary?.expense ?? 0}
            />
            {byCategory.length > 0 && <CategoryChart data={byCategory} />}
          </div>

          {monthly.length > 0 && <MonthlyChart data={monthly} />}

          {/* Transações recentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-base font-semibold"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Transações Recentes
              </h3>
              <button
                onClick={() => navigate("/transactions")}
                className="text-sm transition-colors"
                style={{ color: "#7DB99A" }}
              >
                Ver todas
              </button>
            </div>
            <div
              className="rounded-2xl overflow-hidden divide-y divide-white/[0.04]"
              style={{
                background: "#121814",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {recentTransactions.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
