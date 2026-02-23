export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Salary",
    amount: 6900.75,
    type: "income",
    category: "Job",
    date: "2026-03-01",
  },
  {
    id: "2",
    title: "Groceries",
    amount: 480.8,
    type: "expense",
    category: "Food",
    date: "2026-03-10",
  },
];
