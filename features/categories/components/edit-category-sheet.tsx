import { useOpenCategory } from '@/features/categories/hooks/use-open-category'; // ✅ Hook change
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CategoryForm } from '@/features/categories/components/category-form'; // ✅ Form change
import { insertCategorySchema } from '@/db/schema'; // ✅ Schema change
import z from 'zod';
import { Folder, Loader2 } from 'lucide-react'; // ✅ Icon change
import { useGetCategory } from '@/features/categories/api/use-get-category'; // ✅ API change
import { useEditCategory } from '@/features/categories/api/use-edit-category'; // ✅ API change
import { useDeleteCategory } from '@/features/categories/api/use-delete-category'; // ✅ API change
import { useConfirm } from '@/hooks/use-confirm';

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => { // ✅ Component name change

  const { isOpen, onClose, id } = useOpenCategory(); // ✅ Hook change

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category" // ✅ Text change
  )
  
  const categoryQuery = useGetCategory(id); // ✅ API change
  const editMutation = useEditCategory(id); // ✅ API change
  const deleteMutation = useDeleteCategory(id); // ✅ API change

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

  const defaultValues = categoryQuery.data ? { // ✅ Data change
    name: categoryQuery.data.name
  } : {
    name: "",
  };

  return (
    <>
      <ConfirmDialog/>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='w-full sm:max-w-md lg:max-w-lg'>
          <SheetHeader>
            <SheetTitle className='flex items-center gap-2'>
              <Folder className='h-5 w-5' /> {/* ✅ Icon change */}
              Edit Category {/* ✅ Title change */}
            </SheetTitle>
            <SheetDescription>
              Edit an existing category. {/* ✅ Description change */}
            </SheetDescription>
          </SheetHeader>

          {/* ✅ SCROLLABLE CONTAINER ADD KARO */}
        <div className="max-h-[80vh] overflow-y-auto mt-4 
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                hover:scrollbar-thumb-slate-400 pr-2 -mr-2">
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
         </div>. 
        </SheetContent>
      </Sheet>
    </>
  );
};