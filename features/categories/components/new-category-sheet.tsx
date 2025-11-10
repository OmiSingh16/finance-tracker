import { useNewCategory } from '@/features/categories/hooks/use-new-category'; // ✅ Hook change
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CategoryForm } from '@/features/categories/components/category-form'; // ✅ Form change
import { insertCategorySchema } from '@/db/schema'; // ✅ Schema change
import z from 'zod';
import { useCreateCategory } from '@/features/categories/api/use-create-category'; // ✅ API change
import { Folder } from 'lucide-react'; // ✅ Icon change

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => { // ✅ Component name change
  const { isOpen, onClose } = useNewCategory(); // ✅ Hook change
  const mutation = useCreateCategory(); // ✅ API change

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full sm:max-w-md lg:max-w-lg'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Folder className='h-5 w-5' /> {/* ✅ Icon change */}
            New Category {/* ✅ Title change */}
          </SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions. {/* ✅ Description change */}
          </SheetDescription>
        </SheetHeader>

        {/* ✅ SCROLLABLE CONTAINER ADD KARO */}
        <div className="max-h-[80vh] overflow-y-auto mt-4 
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                hover:scrollbar-thumb-slate-400 pr-2 -mr-2">
        
        <CategoryForm  
        
        
          onSubmit={onSubmit} 
          disabled={mutation.isPending}
        />
        </div>
      </SheetContent>
    </Sheet>
  );
};