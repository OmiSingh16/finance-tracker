'use client';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useBulkDeleteAccount } from '@/features/accounts/api/use-bulk-delete';
import { useConfirm } from '@/hooks/use-confirm';

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export const BulkActions = ({
  selectedIds,
  onClearSelection
}: BulkActionsProps) => {
  const bulkDeleteMutation = useBulkDeleteAccount();
  
  // ADD CONFIRMATION HOOK
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Accounts",
    `Are you sure you want to delete ${selectedIds.length} account(s)? This action cannot be undone.`
  );

  const handleBulkDelete = async () => {
    const ok = await confirm(); // ADD CONFIRMATION
    
    if (ok) {
      bulkDeleteMutation.mutate({ ids: selectedIds }, {
        onSuccess: () => {
          onClearSelection();
        }
      });
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      {/* ADD CONFIRM DIALOG */}
      <ConfirmDialog />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div className="text-sm text-slate-700 whitespace-nowrap">
          {selectedIds.length} account(s) selected
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isPending}
            variant="destructive"
            size="sm"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            <Trash className="h-4 w-4 mr-2" />
            {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete Selected'}
          </Button>
          
          <Button
            onClick={onClearSelection}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </>
  );
};