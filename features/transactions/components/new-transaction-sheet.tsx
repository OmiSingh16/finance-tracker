import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions'; // ✅ Hook change
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TransactionForm } from '@/features/transactions/components/transaction-form'; // ✅ Form change
import { insertTransactionSchema } from '@/db/schema'; // ✅ Schema change
import z from 'zod';
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction'; // ✅ API change
import { Receipt } from 'lucide-react'; // ✅ Icon change

const formSchema = insertTransactionSchema.pick({
  amount: true,
  payee: true,
  notes: true,
  date: true,
  accountId: true,
  categoryId: true,
  type: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => { // ✅ Component name change
  const { isOpen, onClose } = useNewTransaction(); // ✅ Hook change
  const mutation = useCreateTransaction(); // ✅ API change

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
            <Receipt className='h-5 w-5' /> {/* ✅ Icon change */}
            New Transaction {/* ✅ Title change */}
          </SheetTitle>
          <SheetDescription>
            Create a new transaction to track your finances. {/* ✅ Description change */}
          </SheetDescription>
        </SheetHeader>
        
        {/* ✅ SCROLLABLE CONTAINER ADD KARO */}
        <div className="max-h-[80vh] overflow-y-auto mt-4 
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                hover:scrollbar-thumb-slate-400 pr-2 -mr-2">
  <TransactionForm  
    onSubmit={onSubmit} 
    disabled={mutation.isPending}
  />
</div>
      </SheetContent>
    </Sheet>
  );
};