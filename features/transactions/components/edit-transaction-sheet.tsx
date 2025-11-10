import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transactions'; // ✅ Hook change
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TransactionForm } from '@/features/transactions/components/transaction-form'; // ✅ Form change
import { insertTransactionSchema } from '@/db/schema'; // ✅ Schema change
import z from 'zod';
import { Receipt, Loader2 } from 'lucide-react'; // ✅ Icon change
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction'; // ✅ API change
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction'; // ✅ API change
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'; // ✅ API change
import { useConfirm } from '@/hooks/use-confirm';

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

export const EditTransactionSheet = () => { // ✅ Component name change

  const { isOpen, onClose, id } = useOpenTransaction(); // ✅ Hook change

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction" // ✅ Text change
  )
  
  const transactionQuery = useGetTransaction(id); // ✅ API change
  const editMutation = useEditTransaction(id); // ✅ API change
  const deleteMutation = useDeleteTransaction(id); // ✅ API change

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = transactionQuery.isLoading;

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

  const defaultValues = transactionQuery.data ? { // ✅ Data change
    amount: transactionQuery.data.amount,
    payee: transactionQuery.data.payee,
    notes: transactionQuery.data.notes || "",
    date: transactionQuery.data.date,
    accountId: transactionQuery.data.accountId,
    categoryId: transactionQuery.data.categoryId || "",
    type: transactionQuery.data.type || "expense",
  } : {
    amount: 0,
    payee: "",
    notes: "",
    date: new Date(),
    accountId: "",
    categoryId: "",
    type: "expense",
  };

  return (
    <>
      <ConfirmDialog/>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='w-full sm:max-w-md lg:max-w-lg'>
          <SheetHeader>
            <SheetTitle className='flex items-center gap-2'>
              <Receipt className='h-5 w-5' /> {/* ✅ Icon change */}
              Edit Transaction {/* ✅ Title change */}
            </SheetTitle>
            <SheetDescription>
              Edit an existing transaction. {/* ✅ Description change */}
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
            <TransactionForm  
              id={id}
              onSubmit={onSubmit} 
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
          </div>
          
        </SheetContent>
      </Sheet>
    </>
  );
};