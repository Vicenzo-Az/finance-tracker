import type { Transaction } from "@/types";

export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatAmount(transaction: Transaction): string {
  if (transaction.type === "transfer") {
    const sign = transaction.transfer_direction === "out" ? "-" : "+";
    return `${sign}R$ ${transaction.amount.toFixed(2)}`;
  }
  const sign = transaction.type === "income" ? "+" : "-";
  return `${sign}R$ ${transaction.amount.toFixed(2)}`;
}

export function amountClass(transaction: Transaction): string {
  if (transaction.type === "transfer") {
    return transaction.transfer_direction === "out"
      ? "text-right font-semibold text-blue-400"
      : "text-right font-semibold text-blue-500";
  }
  return `text-right font-semibold ${
    transaction.type === "income" ? "text-emerald-500" : "text-red-500"
  }`;
}

export function groupByMonth(
  transactions: Transaction[],
): [string, Transaction[]][] {
  const groups: Record<string, Transaction[]> = {};
  for (const t of transactions) {
    const [year, month] = t.date.split("-");
    const key = `${year}-${month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export function formatMonthHeader(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
