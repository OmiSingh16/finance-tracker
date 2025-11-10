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

type TransactionStats = {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
};

export const useTransactionStats = (transactions: Transaction[]): TransactionStats => {
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netAmount = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netAmount,
      transactionCount: transactions.length,
      incomeCount: transactions.filter(t => t.type === 'income').length,
      expenseCount: transactions.filter(t => t.type === 'expense').length,
    };
  }, [transactions]);

  return stats;
};