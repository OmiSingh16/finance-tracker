import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AccountForm } from '@/features/accounts/components/account-form';
import { insertAccountSchema, accounts } from '@/db/schema';
import z from 'zod';
import { Landmark, Loader2, X } from 'lucide-react';
import { useGetAccount } from '@/features/accounts/api/use-get-account';
import { useEditAccount } from '@/features/accounts/api/use-edit-account';
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account';
import { useConfirm } from '@/hooks/use-confirm';

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {

  const { isOpen, onClose ,id } = useOpenAccount();

  const [ConfirmDialog , confirm]= useConfirm(
    "Are you sure?",
    "You ae about to delete this transaction"
  )
  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
 

  const isPending = editMutation.isPending || deleteMutation.isPending

  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const onDelete = async ()=>{
    const ok = await confirm();

    if(ok){
      deleteMutation.mutate(undefined,{
       onSuccess:()=>{
        onClose();
       } 
      });
    }
  }

  const defaultvalues = accountQuery.data?{
    name: accountQuery.data.name
  }:{
    name:"",
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
                <Landmark className='h-5 w-5' />
                Edit Account
              </SheetTitle>
              <SheetDescription className="text-slate-600">
                Edit an existing accounts.
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Scrollable Content with Box Styling */}
          <div className="flex-1 overflow-hidden px-4 sm:px-3 py-3">
            <div className="h-full border-2 border-blue-300 bg-white rounded-md shadow-sm p-4 sm:p-3">
              <div className="h-full overflow-y-auto 
                      scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent 
                      hover:scrollbar-thumb-slate-400 pr-1 -mr-1">
                {isLoading?(
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Loader2 className='size-4 text-muted-foreground animate-spin'/>
                  </div>
                ):(
                  <AccountForm 
                    id={id}
                    onSubmit={onSubmit} 
                    disabled={isPending}
                    defaultValues={defaultvalues}
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