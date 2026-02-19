import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card
      className="
    relative overflow-hidden
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-2xl
    hover:shadow-black/20
    dark:hover:shadow-black/50
  "
    >
      <div className="absolute top-0 left-0 h-2.5 w-full bg-emerald-500/70 dark:bg-emerald-500/50" />

      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </CardContent>
    </Card>
  );
}
