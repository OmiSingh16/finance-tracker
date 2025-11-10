import { useState, useMemo } from 'react';

// ✅ FLEXIBLE TYPE WITH NULL HANDLING
type Category = {
  id: string;
  name: string;
  type:  string | null; // ✅ ALL POSSIBILITIES COVER
  status: string | null;
  lastUsed: string | null;
  userId: string;
  createdAt: string | null;
  updatedAt: string | null;
  plaidId?: string | null;
};

export const useCategoryFilters = (categories: Category[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
      
      // ✅ SAFE TYPE CHECKING
      const categoryType = (category.type || 'expense').toLowerCase();
      const matchesType = typeFilter === 'all' || categoryType === typeFilter.toLowerCase();
      
      return matchesSearch && matchesType;
    });
  }, [categories, searchQuery, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filteredCategories
  };
};