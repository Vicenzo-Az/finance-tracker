import type { Transaction } from "@/types";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionProvider } from "./TransactionContext";
import { useTransactions } from "./useTransactions";

// Mock do useUser — simula usuário autenticado
const MOCK_USER = { id: "user-1", name: "Teste", email: "teste@valore.com" };

vi.mock("@/context/user/useUser", () => ({
  useUser: () => ({ user: MOCK_USER }),
}));

// Mock do service de transações
vi.mock("@/services/transactionService", () => ({
  getTransactions: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  deleteSingleTransaction: vi.fn(),
  createTransfer: vi.fn(),
}));

import {
  createTransaction,
  deleteSingleTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/services/transactionService";

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "1",
    description: "Teste",
    amount: 100,
    type: "expense",
    date: "2026-01-15",
    user_id: "user-1",
    category_id: null,
    account_id: null,
    transfer_id: null,
    transfer_direction: null,
    is_recurring: false,
    is_paid: true,
    installment_group_id: null,
    installment_number: null,
    installment_total: null,
    ...overrides,
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return <TransactionProvider>{children}</TransactionProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TransactionContext", () => {
  it("carrega transações ao montar quando há usuário autenticado", async () => {
    const fake = [makeTransaction({ id: "1" })];
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue(fake);

    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.transactions).toEqual(fake);
    expect(getTransactions).toHaveBeenCalled();
  });

  it("addTransaction adiciona transações retornadas pela API ao estado", async () => {
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const created = [makeTransaction({ id: "novo" })];
    (createTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(created);

    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addTransaction({
        description: "Novo",
        amount: 100,
        type: "expense",
        date: "2026-01-20",
      });
    });

    expect(result.current.transactions).toEqual(created);
  });

  it("removeTransaction remove a transação do estado local", async () => {
    const initial = [
      makeTransaction({ id: "1" }),
      makeTransaction({ id: "2" }),
    ];
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue(initial);
    (deleteTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.removeTransaction("1");
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe("2");
  });

  it("updateTransaction substitui a transação atualizada no estado", async () => {
    const initial = [makeTransaction({ id: "1", description: "Antigo" })];
    const updated = makeTransaction({ id: "1", description: "Atualizado" });
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue(initial);
    (updateTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(updated);

    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateTransaction("1", {
        description: "Atualizado",
      });
    });

    expect(result.current.transactions[0].description).toBe("Atualizado");
  });

  it("removeSingleTransaction remove apenas a parcela indicada", async () => {
    const initial = [
      makeTransaction({
        id: "1",
        installment_group_id: "g1",
        installment_number: 1,
      }),
      makeTransaction({
        id: "2",
        installment_group_id: "g1",
        installment_number: 2,
      }),
    ];
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue(initial);
    (deleteSingleTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.removeSingleTransaction("1");
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe("2");
  });

  it("removeTransactionGroup remove todas as transações do grupo", async () => {
    const initial = [
      makeTransaction({ id: "1", installment_group_id: "g1" }),
      makeTransaction({ id: "2", installment_group_id: "g1" }),
      makeTransaction({ id: "3", installment_group_id: "g2" }),
    ];
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue(initial);
    (deleteTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.removeTransactionGroup("g1");
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].installment_group_id).toBe("g2");
  });

  it("clearTransactionsByAccount remove transações da conta especificada", async () => {
    const initial = [
      makeTransaction({ id: "1", account_id: "acc-1" }),
      makeTransaction({ id: "2", account_id: "acc-2" }),
    ];
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue(initial);

    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.clearTransactionsByAccount("acc-1");
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].account_id).toBe("acc-2");
  });

  it("addTransactions adiciona múltiplas transações de uma vez", async () => {
    (getTransactions as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { result } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newOnes = [
      makeTransaction({ id: "1" }),
      makeTransaction({ id: "2" }),
    ];

    act(() => {
      result.current.addTransactions(newOnes);
    });

    expect(result.current.transactions).toHaveLength(2);
  });
});
