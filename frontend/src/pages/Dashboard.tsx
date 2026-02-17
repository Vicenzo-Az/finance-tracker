import { StatCard } from "@/components/dashboard/StatCard";

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight mb-6">Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Balance" value="$6,419.95" />
          <StatCard title="Income" value="$6,900.75" />
          <StatCard title="Expenses" value="$-480.80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          Card 1
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          Card 2
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          Card 3
        </div>
      </div>
    </div>
  );
}
