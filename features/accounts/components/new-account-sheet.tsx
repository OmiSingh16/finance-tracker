import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AccountForm } from '@/features/accounts/components/account-form';
import { insertAccountSchema } from '@/db/schema';
import z from 'zod';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { Landmark, X } from 'lucide-react';

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const mutation = useCreateAccount();

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
                <Landmark className='h-5 w-5' />
                New Account
              </SheetTitle>
              <SheetDescription className="text-slate-600">
                Create a new account to track your transactions.
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Scrollable Content with Box Styling */}
          <div className="flex-1 overflow-hidden px-4 sm:px-3 py-3">
            <div className="h-full border-2 border-blue-300 bg-white rounded-md shadow-sm p-4 sm:p-3">
              <div className="max-h-[80vh] overflow-y-auto mt-4 
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                hover:scrollbar-thumb-slate-400 pr-2 -mr-2">
                <AccountForm 
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