
//  ye professional hai

'use client';
// Hooks
import { useNewCategory } from '@/features/categories/hooks/use-new-category';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCategoryFilters } from '@/features/categories/hooks/use-category-filters';
import { useCategorySelection } from '@/features/categories/hooks/use-category-selection';

// Components
import { CategorySearch } from '@/features/categories/components/category-search';
import { CategoryFilter } from '@/features/categories/components/category-filter';
import { BulkActions } from '@/features/categories/components/bulk-actions-category';
import { EmptyCategories } from '@/features/categories/components/empty-categories';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

// Icons
import { Plus, Folder, TrendingUp, TrendingDown, Loader2, Edit, MoreHorizontal } from 'lucide-react';

const CategoryPage = () => {
  const newCategory = useNewCategory();
  const openCategory = useOpenCategory();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data || [];

  // Filter hook
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filteredCategories
  } = useCategoryFilters(categories);

  // Selection hook
  const {
    selectedIds,
    toggleSelection,
    clearSelection,
    isSelected,
    hasSelection
  } = useCategorySelection();

  // Loading state
  if (categoriesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-50 p-6 -mt-8 rounded-t-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Categories</h1>
          <p className="text-slate-600">Loading your financial categories...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-50 p-6 -mt-8 rounded-t-sm">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Categories</h1>
            <p className="text-slate-600">Manage your financial transaction categories</p>
          </div>
          <Button 
            onClick={newCategory.onOpen} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className='h-4 w-4 mr-2'/>
            New Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Categories</p>
                <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
              </div>
              <Folder className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Expense Types</p>
                <p className="text-2xl font-bold text-rose-600">
                  {categories.filter(cat => cat.type === 'expense').length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-rose-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Income Types</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {categories.filter(cat => cat.type === 'income').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-slate-200'>
          <div className="flex-1">
            <CardTitle className='text-xl font-semibold text-slate-800'>
              Category List
            </CardTitle>
            
            {/* Bulk Actions */}
            {hasSelection && (
              <BulkActions 
                selectedIds={selectedIds}
                onClearSelection={clearSelection}
              />
            )}
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <CategorySearch
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <CategoryFilter
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Categories Table */}
          {filteredCategories.length === 0 ? (
            <div className="p-8">
              <EmptyCategories searchQuery={searchQuery} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedIds.length === filteredCategories.length}
                      onCheckedChange={() => {
                        if (selectedIds.length === filteredCategories.length) {
                          clearSelection();
                        } else {
                          // Select all logic here
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">Category Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Type</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Last Used</TableHead>
                  <TableHead className="font-semibold text-slate-700 w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow 
                    key={category.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox 
                        checked={isSelected(category.id)}
                        onCheckedChange={() => toggleSelection(category.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          category.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
                        }`}>
                          <Folder className={`h-4 w-4 ${
                            category.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                          }`} />
                        </div>
                        <span className="font-medium text-slate-800">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.type === 'income' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {category.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      Today
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openCategory.onOpen(category.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Empty State Add Button */}
      
    </div>
  );
};

export default CategoryPage;