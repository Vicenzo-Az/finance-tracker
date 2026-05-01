import { useTransactions } from "@/context";
import { useMemo, useState } from "react";

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
import type { Transaction } from "@/types";

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  return date.toLocaleDateString("pt-BR", {
    // Posteriormente, considerar internacionalização
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Transactions() {
  const { transactions, addTransaction, removeTransaction, updateTransaction } =
    useTransactions();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [dateInputType, setDateInputType] = useState<"text" | "date">("text");

  // Error states for add form
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  // Estados para edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"income" | "expense">("income");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDateInputType, setEditDateInputType] = useState<"text" | "date">(
    "text",
  );

  // Error states for edit form
  const [editErrors, setEditErrors] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  // Sort transactions by date (most recent first)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [transactions]);

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  function validateForm(desc: string, amt: string, dt: string) {
    const newErrors = {
      description: "",
      amount: "",
      category: "",
      date: "",
    };

    // Validate description
    if (!desc.trim()) {
      newErrors.description = "Description is required";
    } else if (desc.trim().length < 3) {
      newErrors.description = "Description must be at least 3 characters";
    }

    // Validate amount
    if (!amt) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amt)) || Number(amt) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    // Category is optional - no validation

    // Validate date
    if (!dt) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(dt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if date is valid
      if (isNaN(selectedDate.getTime())) {
        newErrors.date = "Invalid date";
      } else if (selectedDate.getFullYear() < 1900) {
        newErrors.date = "Year must be 1900 or later";
      } else if (selectedDate > today) {
        newErrors.date = "Date cannot be in the future";
      }
    }

    return newErrors;
  }

  function handleAddTransaction() {
    const newErrors = validateForm(description, amount, date);
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    addTransaction({
      description: description.trim(),
      amount: Number(amount),
      type,
      category: category.trim(),
      date,
    });

    // Resetar campos e erros
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
    setDateInputType("text");
    setErrors({
      description: "",
      amount: "",
      category: "",
      date: "",
    });
  }

  function handleEditClick(transaction: Transaction) {
    setEditingId(transaction.id);
    setEditDescription(transaction.description);
    setEditAmount(transaction.amount.toString());
    setEditType(transaction.type);
    setEditCategory(transaction.category);
    setEditDate(transaction.date);
    setEditDateInputType("date");
    setIsEditDialogOpen(true);
  }

  function handleSaveEdit() {
    if (!editingId) return;

    const newErrors = validateForm(editDescription, editAmount, editDate);
    setEditErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    updateTransaction(editingId, {
      description: editDescription.trim(),
      amount: Number(editAmount),
      type: editType,
      category: editCategory.trim(),
      date: editDate,
    });

    // Resetar e fechar
    setIsEditDialogOpen(false);
    setEditingId(null);
    setEditDescription("");
    setEditAmount("");
    setEditCategory("");
    setEditDate("");
    setEditDateInputType("text");
    setEditErrors({
      description: "",
      amount: "",
      category: "",
      date: "",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header + botão */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-2">
              Adicionar Transação
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Input
                  placeholder="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>

              <Select
                value={type}
                onValueChange={(value) =>
                  setType(value as "income" | "expense")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <div>
                <Input
                  type={dateInputType}
                  placeholder="Selecionar data"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onFocus={() => setDateInputType("date")}
                  onBlur={() => {
                    if (!date) setDateInputType("text");
                  }}
                  min={dateInputType === "date" ? "1900-01-01" : undefined}
                  max={dateInputType === "date" ? todayISO : undefined}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              <Button variant="outline" onClick={handleAddTransaction}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Input
                placeholder="Descrição"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className={editErrors.description ? "border-red-500" : ""}
                autoFocus
              />
              {editErrors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {editErrors.description}
                </p>
              )}
            </div>

            <div>
              <Input
                type="number"
                placeholder="Valor"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className={editErrors.amount ? "border-red-500" : ""}
              />
              {editErrors.amount && (
                <p className="text-sm text-red-500 mt-1">{editErrors.amount}</p>
              )}
            </div>

            <Select
              value={editType}
              onValueChange={(value) =>
                setEditType(value as "income" | "expense")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Categoria (opcional)"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />

            <div>
              <Input
                type={editDateInputType}
                placeholder="Selecionar data"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                onFocus={() => setEditDateInputType("date")}
                onBlur={() => {
                  if (!editDate) setEditDateInputType("text");
                }}
                min={editDateInputType === "date" ? "1900-01-01" : undefined}
                max={editDateInputType === "date" ? todayISO : undefined}
                className={editErrors.date ? "border-red-500" : ""}
              />
              {editErrors.date && (
                <p className="text-sm text-red-500 mt-1">{editErrors.date}</p>
              )}
            </div>

            <Button variant="outline" onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabela */}
      <div className="rounded-xl border border-border bg-card p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>

                <TableCell className="font-medium">
                  {transaction.description}
                </TableCell>

                <TableCell>{transaction.category}</TableCell>

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
                    onClick={() => handleEditClick(transaction)}
                  >
                    Editar
                  </Button>

                  <span className="mx-3" />

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTransaction(transaction.id)}
                  >
                    Deletar
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
