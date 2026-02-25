import { mockTransactions } from "@/data/mockTransactions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Transactions() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mockTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.title}
                </TableCell>

                <TableCell>{transaction.category}</TableCell>

                <TableCell>{transaction.date}</TableCell>

                <TableCell
                  className={`text-right font-semibold ${
                    transaction.type === "income"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
