import { useTransactions } from "@/context/TransactionContext";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Transactions() {
  const { transactions, addTransaction, removeTransaction, updateTransaction } =
    useTransactions();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  function handleAddTransaction() {
    if (!description || !amount || !category || !date) return;

    addTransaction({
      description,
      amount: Number(amount),
      type,
      category,
      date,
    });

    // Resetar campos
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
  }

  return (
    <div className="space-y-8">
      {/* Header + botão */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-2">
              Add Transaction
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Select
                value={type}
                onValueChange={(value) =>
                  setType(value as "income" | "expense")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Button variant="outline" onClick={handleAddTransaction}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-border bg-card p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.description}
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

                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateTransaction(transaction.id, transaction)
                    }
                  >
                    Edit
                  </Button>

                  <span className="mx-3" />

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTransaction(transaction.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
