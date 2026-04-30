// ─── Transação ────────────────────────────────────────────────────────────────

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO 8601: "2025-01-02"
}

export type CreateTransactionInput = Omit<Transaction, "id">;

export type UpdateTransactionInput = Partial<Omit<Transaction, "id">>;

// ─── Resumo financeiro (resposta do /upload) ──────────────────────────────────

export interface Summary {
  income: number;
  expense: number;
}

export interface UploadResponse {
  summary: Summary;
  balance: number;
}

// ─── Erros da API ─────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
