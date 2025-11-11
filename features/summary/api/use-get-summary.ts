import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface UseGetSummaryProps {
  from?: string;
  to?: string;
  accountId?: string;
}

interface SummaryResponse {
  periodComparison: {
    currentPeriod: { income: number; expenses: number; remaining: number };
    lastPeriod: { income: number; expenses: number; remaining: number };
  };
  charts: {
    dailyTrends: Array<{ date: string; income: number; expenses: number; net: number }>;
    categoryBreakdown: {
      expenses: Array<{ name: string; value: number; type: 'expense' }>;
      income: Array<{ name: string; value: number; type: 'income' }>;
    };
    accountBreakdown: Array<{ name: string; balance: number; type: string }>;
    monthlyComparison: {
      current: { income: number; expenses: number; remaining: number };
      last: { income: number; expenses: number; remaining: number };
    };
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    transactionCount: number;
  };
  meta: { dateRange: { start: string; end: string; periodLength: number }; accountFilter: string };
}

export const useGetSummary = ({ from, to, accountId }: UseGetSummaryProps = {}) => {
  // ✅ Compute default last 7 days if from/to not provided
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultFrom = new Date(today);
  defaultFrom.setDate(today.getDate() - 6); // last 7 days including today

  const finalFrom = from || defaultFrom.toISOString().split('T')[0];
  const finalTo = to || today.toISOString().split('T')[0];

  const query = useQuery({
    queryKey: ["summary", { from: finalFrom, to: finalTo, accountId }],
    queryFn: async () => {
      // @ts-ignore
      const response = await client.api.summary.$get({
        query: { from: finalFrom, to: finalTo, accountId },
      });
      if (!response.ok) throw new Error("Failed to fetch summary");
      return response.json() as Promise<SummaryResponse>;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
    enabled: true, // always enabled now
  });

  return query;
};
