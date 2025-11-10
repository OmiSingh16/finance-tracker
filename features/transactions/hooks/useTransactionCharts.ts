import { useMemo } from 'react';

// ✅ Manual types define karo
type Transaction = {
  id: string;
  amount: number;
  payee: string;
  notes: string | null;
  date: Date;
  accountId: string;
  categoryId: string | null;
  userId: string;
  type: string;
  createdAt: Date | null;
  accountName: string;
  categoryName: string | null;
};

type ChartData = {
  categoryData: { name: string; value: number }[];
  monthlyData: { month: string; income: number; expense: number }[];
};

export const useTransactionCharts = (transactions: Transaction[]): ChartData => {
  const chartData = useMemo(() => {
    // Category-wise spending
    const categoryData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.categoryName || 'Uncategorized';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Monthly trends
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      const key = `${month}`;
      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[key].income += t.amount;
      } else {
        acc[key].expense += t.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    return {
      categoryData: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense
      }))
    };
  }, [transactions]);

  return chartData;
};