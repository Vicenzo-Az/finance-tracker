import type { Transaction } from "@/types";
import { describe, expect, it } from "vitest";
import {
    amountClass,
    formatAmount,
    formatMonthHeader,
    groupByMonth,
} from "./transactionFormat";

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

describe("formatAmount", () => {
  it("formata despesa com sinal negativo", () => {
    const t = makeTransaction({ type: "expense", amount: 150 });
    expect(formatAmount(t)).toBe("-R$ 150.00");
  });

  it("formata receita com sinal positivo", () => {
    const t = makeTransaction({ type: "income", amount: 5000 });
    expect(formatAmount(t)).toBe("+R$ 5000.00");
  });

  it("formata transferência de saída com sinal negativo", () => {
    const t = makeTransaction({
      type: "transfer",
      amount: 300,
      transfer_direction: "out",
    });
    expect(formatAmount(t)).toBe("-R$ 300.00");
  });

  it("formata transferência de entrada com sinal positivo", () => {
    const t = makeTransaction({
      type: "transfer",
      amount: 300,
      transfer_direction: "in",
    });
    expect(formatAmount(t)).toBe("+R$ 300.00");
  });
});

describe("amountClass", () => {
  it("retorna classe vermelha para despesa", () => {
    const t = makeTransaction({ type: "expense" });
    expect(amountClass(t)).toContain("text-red-500");
  });

  it("retorna classe verde para receita", () => {
    const t = makeTransaction({ type: "income" });
    expect(amountClass(t)).toContain("text-emerald-500");
  });

  it("retorna classe azul para transferência", () => {
    const t = makeTransaction({ type: "transfer", transfer_direction: "in" });
    expect(amountClass(t)).toContain("text-blue-500");
  });
});

describe("groupByMonth", () => {
  it("agrupa transações pelo mês corretamente", () => {
    const transactions = [
      makeTransaction({ id: "1", date: "2026-01-10" }),
      makeTransaction({ id: "2", date: "2026-01-20" }),
      makeTransaction({ id: "3", date: "2026-02-05" }),
    ];

    const grouped = groupByMonth(transactions);

    expect(grouped).toHaveLength(2);
    const [firstKey, firstGroup] = grouped[0];
    expect(firstKey).toBe("2026-02");
    expect(firstGroup).toHaveLength(1);
  });

  it("ordena os meses do mais recente para o mais antigo", () => {
    const transactions = [
      makeTransaction({ id: "1", date: "2025-12-01" }),
      makeTransaction({ id: "2", date: "2026-03-01" }),
      makeTransaction({ id: "3", date: "2026-01-01" }),
    ];

    const grouped = groupByMonth(transactions);
    const keys = grouped.map(([key]) => key);

    expect(keys).toEqual(["2026-03", "2026-01", "2025-12"]);
  });

  it("retorna array vazio para lista vazia", () => {
    expect(groupByMonth([])).toEqual([]);
  });
});

describe("formatMonthHeader", () => {
  it("formata mês e ano em português", () => {
    const result = formatMonthHeader("2026-01");
    expect(result.toLowerCase()).toContain("janeiro");
    expect(result).toContain("2026");
  });
});
