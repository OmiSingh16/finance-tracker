import { useCallback } from 'react';

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

export const useTransactionExport = () => {
  const exportToCSV = useCallback((transactions: Transaction[], filename: string = 'transactions.csv') => {
    const headers = ['Date', 'Payee', 'Amount', 'Type', 'Category', 'Account', 'Notes'];
    
    const csvData = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.payee,
      t.amount.toString(),
      t.type || 'expense',
      t.categoryName || 'Uncategorized',
      t.accountName || 'Unknown',
      t.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }, []);

  return { exportToCSV };
};