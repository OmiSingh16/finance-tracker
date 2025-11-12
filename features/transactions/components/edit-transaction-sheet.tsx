import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transactions';
import {
  SheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { TransactionForm } from '@/features/transactions/components/transaction-form';
import { insertTransactionSchema } from '@/db/schema';
import z from 'zod';
import { Receipt, Loader2 } from 'lucide-react';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
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

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

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

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  // ✅ FIXED: date must be a string (ISO format)
  const defaultValues: FormValues = transactionQuery.data
    ? {
        amount: transactionQuery.data.amount,
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes || "",
        date:
          transactionQuery.data.date instanceof Date
            ? transactionQuery.data.date.toISOString().split("T")[0]
            : transactionQuery.data.date,
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId || "",
        type: transactionQuery.data.type || "expense",
      }
    : {
        amount: 0,
        payee: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
        accountId: "",
        categoryId: "",
        type: "expense",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='w-full sm:max-w-md lg:max-w-lg p-0'>
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="px-4 sm:px-6 py-6 border-b border-slate-200">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 text-slate-800">
                  <Receipt className="h-5 w-5" />
                  Edit Transaction
                </SheetTitle>
                <SheetDescription className="text-slate-600">
                  Edit an existing transaction.
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="size-4 text-muted-foreground animate-spin" />
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
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};