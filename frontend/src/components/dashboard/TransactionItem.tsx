import type { Transaction } from "@/types";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
      <div>
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-muted-foreground">
          {transaction.category} • {transaction.date}
        </p>
      </div>

      <p
        className={`font-semibold ${
          isIncome ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
      </p>
    </div>
  );
}
