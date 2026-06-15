import api from "@/lib/api";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    createTransaction,
    createTransfer,
    deleteSingleTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction,
} from "./transactionService";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("transactionService", () => {
  it("getTransactions chama GET /transactions/ com filtros", async () => {
    mockedApi.get.mockResolvedValue({ data: [] });

    await getTransactions({ type: "income" });

    expect(mockedApi.get).toHaveBeenCalledWith("/transactions/", {
      params: { type: "income" },
    });
  });

  it("createTransaction chama POST /transactions/ e retorna array", async () => {
    const fakeTransaction = { id: "1", description: "Salário" };
    mockedApi.post.mockResolvedValue({ data: [fakeTransaction] });

    const result = await createTransaction({
      description: "Salário",
      amount: 5000,
      type: "income",
      date: "2026-01-05",
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/transactions/",
      expect.objectContaining({ description: "Salário" }),
    );
    expect(result).toEqual([fakeTransaction]);
  });

  it("updateTransaction chama PUT /transactions/:id", async () => {
    mockedApi.put.mockResolvedValue({ data: { id: "1", description: "Novo" } });

    await updateTransaction("1", { description: "Novo" });

    expect(mockedApi.put).toHaveBeenCalledWith("/transactions/1", {
      description: "Novo",
    });
  });

  it("deleteTransaction chama DELETE /transactions/:id", async () => {
    mockedApi.delete.mockResolvedValue({});

    await deleteTransaction("1");

    expect(mockedApi.delete).toHaveBeenCalledWith("/transactions/1");
  });

  it("deleteSingleTransaction chama DELETE /transactions/:id/single", async () => {
    mockedApi.delete.mockResolvedValue({});

    await deleteSingleTransaction("1");

    expect(mockedApi.delete).toHaveBeenCalledWith("/transactions/1/single");
  });

  it("createTransfer chama POST /transactions/transfer", async () => {
    const fakeTransfer = [{ id: "1" }, { id: "2" }];
    mockedApi.post.mockResolvedValue({ data: fakeTransfer });

    const result = await createTransfer({
      from_account_id: "acc-1",
      to_account_id: "acc-2",
      amount: 300,
      date: "2026-01-10",
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/transactions/transfer",
      expect.objectContaining({
        from_account_id: "acc-1",
        to_account_id: "acc-2",
      }),
    );
    expect(result).toEqual(fakeTransfer);
  });
});
