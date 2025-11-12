// import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions'; // ✅ Hook change
// import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { TransactionForm } from '@/features/transactions/components/transaction-form'; // ✅ Form change
// import { insertTransactionSchema } from '@/db/schema'; // ✅ Schema change
// import z from 'zod';
// import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction'; // ✅ API change
// import { Receipt } from 'lucide-react'; // ✅ Icon change

// const formSchema = insertTransactionSchema.pick({
//   amount: true,
//   payee: true,
//   notes: true,
//   date: true,
//   accountId: true,
//   categoryId: true,
//   type: true,
// });

// type FormValues = z.input<typeof formSchema>;

// export const NewTransactionSheet = () => { // ✅ Component name change
//   const { isOpen, onClose } = useNewTransaction(); // ✅ Hook change
//   const mutation = useCreateTransaction(); // ✅ API change

//   const onSubmit = (values: FormValues) => {
//     mutation.mutate(values, {
//       onSuccess: () => {
//         onClose();
//       }
//     });
//   }

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className='w-full sm:max-w-md lg:max-w-lg'>
//         <SheetHeader>
//           <SheetTitle className='flex items-center gap-2'>
//             <Receipt className='h-5 w-5' /> {/* ✅ Icon change */}
//             New Transaction {/* ✅ Title change */}
//           </SheetTitle>
//           <SheetDescription>
//             Create a new transaction to track your finances. {/* ✅ Description change */}
//           </SheetDescription>
//         </SheetHeader>
        
//         {/* ✅ SCROLLABLE CONTAINER ADD KARO */}
//         <div className="max-h-[80vh] overflow-y-auto mt-4 
//                 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
//                 hover:scrollbar-thumb-slate-400 pr-2 -mr-2">
//   <TransactionForm  
//     onSubmit={onSubmit} 
//     disabled={mutation.isPending}
//   />
// </div>
//       </SheetContent>
//     </Sheet>
//   );
// };




import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions';
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TransactionForm } from '@/features/transactions/components/transaction-form';
import { insertTransactionSchema } from '@/db/schema';
import z from 'zod';
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction';
import { Receipt } from 'lucide-react';

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

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const mutation = useCreateTransaction();

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
                <Receipt className='h-5 w-5' />
                New Transaction
              </SheetTitle>
              <SheetDescription className="text-slate-600">
                Create a new transaction to track your finances.
              </SheetDescription>
            </SheetHeader>
          </div>
          
          {/* Scrollable Content with Box Styling */}
          <div className="flex-1 overflow-hidden px-4 sm:px-3 py-3">
            <div className="h-full border-2 border-blue-300 bg-white rounded-md shadow-sm p-4 sm:p-3">
              <div className="max-h-[80vh] overflow-y-auto mt-4 
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                hover:scrollbar-thumb-slate-400 pr-2 -mr-2">
                <TransactionForm  
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