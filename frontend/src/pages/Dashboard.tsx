import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTransactions } from "@/context";
import { FileUp, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const navigate = useNavigate();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;
  const isEmpty = transactions.length === 0;

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight leading-none mb-6">
          Visão Geral
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Saldo Total" value={`$${balance.toFixed(2)}`} />
          <StatCard title="Renda" value={`$${income.toFixed(2)}`} />
          <StatCard title="Despesas" value={`$${expenses.toFixed(2)}`} />
        </div>
      </div>

      {isEmpty ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Nenhuma transação adicionada ainda
              </h3>
              <p className="text-muted-foreground text-sm">
                Comece a rastrear suas finanças adicionando sua primeira
                transação ou importando dados de um arquivo CSV.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/transactions")}
                className="gap-2"
              >
                <PlusCircle size={18} />
                Adicionar Transação
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/transactions")}
                className="gap-2"
              >
                <FileUp size={18} />
                Fazer Upload de CSV
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Dica: Você pode adicionar receitas e despesas manualmente ou
                fazer upload de um CSV com seu histórico de transações para
                começar rapidamente.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <IncomeExpenseChart income={income} expenses={expenses} />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Transações Recentes</h3>

            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  // TODO: order by date and group by month
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
