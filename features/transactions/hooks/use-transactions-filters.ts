import { useState, useMemo } from 'react';

type Transaction = {
  id: string;
  amount: number;
  payee: string;
  notes: string | null;
  date: Date;
  accountId: string;
  categoryId: string | null;
  userId: string;
  type: string; // ✅ Change to string only (not null)
  createdAt: Date | null;
  accountName: string; // ✅ Make required
  categoryName: string | null;
};

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = 
        transaction.payee.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (transaction.notes && transaction.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesAccount = accountFilter === 'all' || transaction.accountId === accountFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.categoryId === categoryFilter;
      
      return matchesSearch && matchesType && matchesAccount && matchesCategory;
    });
  }, [transactions, searchQuery, typeFilter, accountFilter, categoryFilter]);

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions
  };
};