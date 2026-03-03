import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
    CreateTransactionInput,
    Transaction,
    UpdateTransactionInput,
} from "@/types";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

/**
 * Interface do contexto de transações
 */
interface TransactionContextType {
  /** Lista de todas as transações */
  transactions: Transaction[];
  /** Adiciona uma nova transação */
  addTransaction: (transaction: CreateTransactionInput) => void;
  /** Remove uma transação pelo ID */
  removeTransaction: (id: string) => void;
  /** Atualiza uma transação existente */
  updateTransaction: (id: string, transaction: UpdateTransactionInput) => void;
  /** Remove todas as transações */
  clearTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

interface TransactionProviderProps {
  children: ReactNode;
}

/**
 * Provider que gerencia o estado global de transações
 * Persiste automaticamente no localStorage
 *
 * @example
 * ```tsx
 * <TransactionProvider>
 *   <App />
 * </TransactionProvider>
 * ```
 */
export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    [],
  );

  const addTransaction = (transaction: CreateTransactionInput) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (
    id: string,
    updatedData: UpdateTransactionInput,
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)),
    );
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  const value: TransactionContextType = {
    transactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
    clearTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de transações
 *
 * @throws {Error} Se usado fora de TransactionProvider
 * @returns {TransactionContextType} Objeto com transações e funções para manipulá-las
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { transactions, addTransaction } = useTransactions();
 *
 *   const handleAdd = () => {
 *     addTransaction({
 *       description: 'Salário',
 *       amount: 5000,
 *       type: 'income',
 *       category: 'Trabalho',
 *       date: new Date().toISOString()
 *     });
 *   };
 *
 *   return <div>{transactions.length} transações</div>;
 * }
 * ```
 */
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions deve ser usado dentro de TransactionProvider",
    );
  }
  return context;
}
