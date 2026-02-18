import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card
      className="
    rounded-xl p-5
    bg-white dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-800

    transition-all duration-200
    hover:-translate-y-0.5
    hover:shadow-xl
    hover:shadow-zinc-900/10
    dark:hover:shadow-black/40

    hover:ring-4 hover:ring-emerald-500/20
  "
    >
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </CardContent>
    </Card>
  );
}
