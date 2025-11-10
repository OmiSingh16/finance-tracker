'use client';
import { Folder, Plus } from 'lucide-react'; // ✅ Icon change
import { Button } from '@/components/ui/button';
import { useNewCategory } from '@/features/categories/hooks/use-new-category'; // ✅ Hook change

interface EmptyCategoriesProps { // ✅ Interface name change
  searchQuery?: string;
}

export const EmptyCategories = ({ searchQuery }: EmptyCategoriesProps) => { // ✅ Component name change
  const newCategory = useNewCategory(); // ✅ Hook change

  if (searchQuery) {
    return (
      <div className="text-center py-12">
        <Folder className="h-16 w-16 text-slate-300 mx-auto mb-4" /> {/* ✅ Icon change */}
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No categories found</h3> {/* ✅ Text change */}
        <p className="text-slate-500">
          No categories match "<span className="font-medium">{searchQuery}</span>" {/* ✅ Text change */}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Folder className="h-16 w-16 text-slate-300 mx-auto mb-4" /> {/* ✅ Icon change */}
      <h3 className="text-lg font-semibold text-slate-700 mb-2">No categories yet</h3> {/* ✅ Text change */}
      <p className="text-slate-500 mb-6">Create your first category to get started</p> {/* ✅ Text change */}
      <Button
        onClick={newCategory.onOpen} // ✅ Hook change
        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create First Category {/* ✅ Text change */}
      </Button>
    </div>
  );
};