import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface UseGetSummaryProps {
  from?: string;
  to?: string;
  accountId?: string;
}

interface SummaryResponse {
  periodComparison: {
    currentPeriod: {
      income: number;
      expenses: number;
      remaining: number;
    };
    lastPeriod: {
      income: number;
      expenses: number;
      remaining: number;
    };
  };
  charts: {
    dailyTrends: Array<{
      date: string;
      income: number;
      expenses: number;
      net: number;
    }>;
    categoryBreakdown: {
      expenses: Array<{ name: string; value: number; type: 'expense' }>;
      income: Array<{ name: string; value: number; type: 'income' }>;
    };
    accountBreakdown: Array<{
      name: string;
      balance: number;
      type: string;
    }>;
    monthlyComparison: {
      current: {
        income: number;
        expenses: number;
        remaining: number;
      };
      last: {
        income: number;
        expenses: number;
        remaining: number;
      };
    };
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    transactionCount: number;
  };
  meta: {
    dateRange: {
      start: string;
      end: string;
      periodLength: number;
    };
    accountFilter: string;
  };
}

export const useGetSummary = ({ from, to, accountId }: UseGetSummaryProps = {}) => {
  // ✅ DYNAMIC DATE CALCULATION - Browser time use karo
  const getDynamicDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day

    if (from && to) {
      return { from, to }; // Custom range if provided
    }

    // ✅ Default: Last 7 days
    const defaultFrom = new Date(today);
    defaultFrom.setDate(today.getDate() - 7);

    return {
      from: defaultFrom.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0],
    };
  };

  const { from: finalFrom, to: finalTo } = getDynamicDates();

  const query = useQuery({
    queryKey: ["summary", { from: finalFrom, to: finalTo, accountId }],
    queryFn: async () => {
      // @ts-ignore
      const response = await client.api.summary.$get({
        query: {
          from: finalFrom,
          to: finalTo,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const result: SummaryResponse = await response.json();
      return result;
    },
    // ✅ Auto refetch config
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  return query;
};
