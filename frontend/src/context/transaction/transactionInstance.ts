import { createContext } from "react";
import type { TransactionContextType } from "./types";

export const TransactionContext = createContext<
  TransactionContextType | undefined
>(undefined);
