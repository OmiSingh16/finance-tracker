import { useState, useMemo } from 'react';

// ✅ CORRECT TYPE - Match your actual data
type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense'; // ✅ Change to match your data
  status?: string | null;
  lastUsed?: string | null;
  userId?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  plaidId?: string | null;
};
export const useCategoryFilters = (categories: Category[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all'); // ✅ String instead of specific

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // ✅ Safe type checking
      const matchesType = 
        typeFilter === 'all' || 
        category.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [categories, searchQuery, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter, // ✅ Now accepts any string
    filteredCategories
  };
};