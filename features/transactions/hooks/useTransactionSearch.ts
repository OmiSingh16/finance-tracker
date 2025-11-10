import { useState, useMemo } from 'react';

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

export const useTransactionSearch = (transactions: Transaction[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState<number | ''>('');
  const [maxAmount, setMaxAmount] = useState<number | ''>('');

  const searchedTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = searchTerm === '' || 
        transaction.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.categoryName && transaction.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMinAmount = minAmount === '' || transaction.amount >= minAmount;
      const matchesMaxAmount = maxAmount === '' || transaction.amount <= maxAmount;

      return matchesSearch && matchesMinAmount && matchesMaxAmount;
    });
  }, [transactions, searchTerm, minAmount, maxAmount]);

  return {
    searchTerm,
    setSearchTerm,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    searchedTransactions
  };
};