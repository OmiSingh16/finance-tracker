'use client';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'; // ✅ API change
import { useConfirm } from '@/hooks/use-confirm';

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export const BulkActions = ({
  selectedIds,
  onClearSelection
}: BulkActionsProps) => {
  const bulkDeleteMutation = useBulkDeleteTransactions(); // ✅ API change
  
  // UPDATE CONFIRMATION MESSAGE
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Transactions", // ✅ Text change
    `Are you sure you want to delete ${selectedIds.length} transaction${selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.` // ✅ Text change
  );

  const handleBulkDelete = async () => {
    const ok = await confirm();
    
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
      <ConfirmDialog />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div className="text-sm text-slate-700 whitespace-nowrap">
          {selectedIds.length} transaction{selectedIds.length === 1 ? '' : 's'} selected {/* ✅ Text change */}
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