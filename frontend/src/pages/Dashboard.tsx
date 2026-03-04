import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionContext";
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
          Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Balance" value={`$${balance.toFixed(2)}`} />
          <StatCard title="Income" value={`$${income.toFixed(2)}`} />
          <StatCard title="Expenses" value={`$${expenses.toFixed(2)}`} />
        </div>
      </div>

      {isEmpty ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No transactions yet</h3>
              <p className="text-muted-foreground text-sm">
                Start tracking your finances by adding your first transaction or
                importing data from a CSV file.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/transactions")}
                className="gap-2"
              >
                <PlusCircle size={18} />
                Add Transaction
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/transactions")}
                className="gap-2"
              >
                <FileUp size={18} />
                Upload CSV
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Tip: You can add income and expenses manually, or upload a CSV
                with your transaction history to get started quickly.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <IncomeExpenseChart income={income} expenses={expenses} />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Transactions</h3>

            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  // TODO: order by date
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
