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

export const useTransactionPagination = (transactions: Transaction[], pageSize: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage, pageSize]);

  const totalPages = Math.ceil(transactions.length / pageSize);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};