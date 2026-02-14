import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </CardContent>
    </Card>
  );
}
