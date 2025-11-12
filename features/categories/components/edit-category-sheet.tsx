import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CategoryForm } from '@/features/categories/components/category-form';
import { insertCategorySchema } from '@/db/schema';
import z from 'zod';
import { Folder, Loader2 } from 'lucide-react';
import { useGetCategory } from '@/features/categories/api/use-get-category';
import { useEditCategory } from '@/features/categories/api/use-edit-category';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useConfirm } from '@/hooks/use-confirm';

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {

  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category"
  )
  
  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if(ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        } 
      });
    }
  }

  const defaultValues = categoryQuery.data ? {
    name: categoryQuery.data.name
  } : {
    name: "",
  };

  return (
    <>
      <ConfirmDialog/>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='w-full sm:max-w-md lg:max-w-lg p-0'>
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="px-4 sm:px-6 py-6 border-b border-slate-200">
              <SheetHeader className="text-left">
                <SheetTitle className='flex items-center gap-2 text-slate-800'>
                  <Folder className='h-5 w-5' />
                  Edit Category
                </SheetTitle>
                <SheetDescription className="text-slate-600">
                  Edit an existing category.
                </SheetDescription>
              </SheetHeader>
            </div>

            {/* Scrollable Content with Box Styling */}
            <div className="flex-1 overflow-hidden px-4 sm:px-3 py-3">
              <div className="h-full border-2 border-blue-300 bg-white rounded-md shadow-sm p-4 sm:p-3">
                <div className="h-full overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                        hover:scrollbar-thumb-slate-400 pr-1 -mr-1">
                  {isLoading ? (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Loader2 className='size-4 text-muted-foreground animate-spin'/>
                    </div>
                  ) : (
                    <CategoryForm  
                      id={id}
                      onSubmit={onSubmit} 
                      disabled={isPending}
                      defaultValues={defaultValues}
                      onDelete={onDelete}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};