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
      <SheetContent className='w-full sm:max-w-md lg:max-w-lg'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Landmark className='h-5 w-5' />
            New Account
          </SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>

        {/* ✅ SCROLLABLE CONTAINER ADD KARO */}
        <div className="max-h-[80vh] overflow-y-auto mt-4 
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                hover:scrollbar-thumb-slate-400 pr-2 -mr-2">
        
        <AccountForm 
          onSubmit={onSubmit} 
          disabled={mutation.isPending}
        />
        </div>
      </SheetContent>
    </Sheet>
  );
};