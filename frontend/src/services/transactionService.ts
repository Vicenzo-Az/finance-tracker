import api from "@/lib/api";
import type {
    CreateTransactionInput,
    Transaction,
    UpdateTransactionInput,
} from "@/types/finance";

/**
 * Busca todas as transações do usuário.
 */
export async function getTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data;
}

/**
 * Busca uma transação pelo ID.
 */
export async function getTransaction(id: string): Promise<Transaction> {
  const { data } = await api.get<Transaction>(`/transactions/${id}`);
  return data;
}

/**
 * Cria uma nova transação.
 */
export async function createTransaction(
  input: CreateTransactionInput,
): Promise<Transaction> {
  const { data } = await api.post<Transaction>("/transactions", input);
  return data;
}

/**
 * Atualiza uma transação existente.
 */
export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<Transaction> {
  const { data } = await api.put<Transaction>(`/transactions/${id}`, input);
  return data;
}

/**
 * Remove uma transação.
 */
export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
