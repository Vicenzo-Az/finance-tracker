import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { mockTransactions } from "@/data/mockTransactions";

const income = mockTransactions
  .filter((t) => t.type === "income")
  .reduce((acc, t) => acc + t.amount, 0);

const expenses = mockTransactions
  .filter((t) => t.type === "expense")
  .reduce((acc, t) => acc + t.amount, 0);

const balance = income - expenses;

export default function Dashboard() {
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

      <IncomeExpenseChart income={income} expenses={expenses} />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Transactions</h3>

        <div className="space-y-3">
          {mockTransactions.slice(0, 5).map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}
