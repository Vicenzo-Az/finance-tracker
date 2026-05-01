import { useContext } from "react";
import { TransactionContext } from "./transactionInstance";

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions deve ser usado dentro de TransactionProvider",
    );
  }
  return context;
}
