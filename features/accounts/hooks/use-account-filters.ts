import { useState, useMemo } from 'react';

export const useAccountFilters = (accounts: any[]) => { // any use karo temporary
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account: any) => {
      const matchesSearch = account.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || account.type?.toLowerCase() === typeFilter.toLowerCase();
      
      return matchesSearch && matchesType;
    });
  }, [accounts, searchQuery, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filteredAccounts
  };
};