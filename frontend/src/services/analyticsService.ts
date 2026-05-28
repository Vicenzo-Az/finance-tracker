import api from "@/lib/api";
import type {
  AnalyticsSummary,
  CategoryData,
  MonthlyData,
  TrendsData,
} from "@/types";

export async function getSummary(): Promise<AnalyticsSummary> {
  const { data } = await api.get<AnalyticsSummary>("/analytics/summary");
  return data;
}

export async function getMonthly(year?: number): Promise<MonthlyData[]> {
  const { data } = await api.get<MonthlyData[]>("/analytics/monthly", {
    params: year ? { year } : undefined,
  });
  return data;
}

export async function getByCategory(
  type?: "income" | "expense",
): Promise<CategoryData[]> {
  const { data } = await api.get<CategoryData[]>("/analytics/by-category", {
    params: type ? { type } : undefined,
  });
  return data;
}

export async function getTrends(): Promise<TrendsData> {
  const { data } = await api.get<TrendsData>("/analytics/trends");
  return data;
}

export interface RecurringAverageData {
  average_monthly: number;
  total_recurring: number;
  n_months: number;
  by_category: {
    category_id: string;
    category_name: string;
    category_color: string;
    category_icon: string;
    total: number;
    monthly_average: number;
  }[];
}

export interface CompareMonthsData {
  month_a: {
    month: string;
    income: number;
    expense: number;
    balance: number;
    transaction_count: number;
  };
  month_b: {
    month: string;
    income: number;
    expense: number;
    balance: number;
    transaction_count: number;
  };
  variation: {
    income: number | null;
    expense: number | null;
    balance: number | null;
  };
}

export async function getRecurringAverage(): Promise<RecurringAverageData> {
  const { data } = await api.get<RecurringAverageData>(
    "/analytics/recurring-average",
  );
  return data;
}

export async function compareMonths(
  monthA: string,
  monthB: string,
): Promise<CompareMonthsData> {
  const { data } = await api.get<CompareMonthsData>(
    "/analytics/compare-months",
    {
      params: { month_a: monthA, month_b: monthB },
    },
  );
  return data;
}

export interface FutureCommitmentsData {
  total_pending: number;
  by_month: { month: string; total: number }[];
  by_group: {
    installment_group_id: string;
    description: string;
    installment_total: number;
    remaining_installments: number;
    remaining_total: number;
    installment_amount: number;
    next_due: string;
  }[];
}

export async function getFutureCommitments(): Promise<FutureCommitmentsData> {
  const { data } = await api.get<FutureCommitmentsData>(
    "/analytics/future-commitments",
  );
  return data;
}
