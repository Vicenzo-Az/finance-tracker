import { StatCard } from "@/components/dashboard/StatCard";

export default function Dashboard() {
  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight leading-none mb-6">
          Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Balance" value="$6,419.95" />
          <StatCard title="Income" value="$6,900.75" />
          <StatCard title="Expenses" value="$-480.80" />
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
