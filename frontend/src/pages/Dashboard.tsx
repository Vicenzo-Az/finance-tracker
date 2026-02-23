import { StatCard } from "@/components/dashboard/StatCard";
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

      <div>
        <h3 className="text-2xl font-semibold tracking-tight leading-none mb-6">
          Outros Dados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Card 1" value="$0.00" />
          <StatCard title="Card 2" value="$0.00" />
          <StatCard title="Card 3" value="$0.00" />
        </div>
      </div>
    </div>
  );
}
