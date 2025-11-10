import { useState } from 'react';

export const useCategorySelection = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = (allIds: string[]) => {
    setSelectedIds(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    isSelected: (id: string) => selectedIds.includes(id),
    hasSelection: selectedIds.length > 0
  };
};