import { useNewCategory } from '@/features/categories/hooks/use-new-category';
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CategoryForm } from '@/features/categories/components/category-form';
import { insertCategorySchema } from '@/db/schema';
import z from 'zod';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { Folder } from 'lucide-react';

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();
  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full sm:max-w-md lg:max-w-lg p-0'>
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="px-4 sm:px-6 py-6 border-b border-slate-200">
            <SheetHeader className="text-left">
              <SheetTitle className='flex items-center gap-2 text-slate-800'>
                <Folder className='h-5 w-5' />
                New Category
              </SheetTitle>
              <SheetDescription className="text-slate-600">
                Create a new category to organize your transactions.
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Scrollable Content with Box Styling */}
          <div className="flex-1 overflow-hidden px-4 sm:px-3 py-3">
            <div className="h-full border-2 border-blue-300 bg-white rounded-md shadow-sm p-4 sm:p-3">
              <div className="h-full overflow-y-auto 
                      scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                      hover:scrollbar-thumb-slate-400 pr-1 -mr-1">
                <CategoryForm  
                  onSubmit={onSubmit} 
                  disabled={mutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};