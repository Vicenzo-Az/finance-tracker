/**
 * Tipo de transação financeira
 */
export type TransactionType = "income" | "expense";

/**
 * Interface que representa uma transação financeira
 */
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

/**
 * Tipo para criar uma nova transação (sem o ID)
 */
export type CreateTransactionInput = Omit<Transaction, "id">;

/**
 * Tipo para atualizar uma transação existente (campos opcionais)
 */
export type UpdateTransactionInput = Partial<Omit<Transaction, "id">>;
