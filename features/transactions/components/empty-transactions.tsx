'use client';
import { Receipt, Plus } from 'lucide-react'; // ✅ Icon change
import { Button } from '@/components/ui/button';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions'; // ✅ Hook change

interface EmptyTransactionsProps { // ✅ Interface name change
  searchQuery?: string;
}

export const EmptyTransactions = ({ searchQuery }: EmptyTransactionsProps) => { // ✅ Component name change
  const newTransaction = useNewTransaction(); // ✅ Hook change

  if (searchQuery) {
    return (
      <div className="text-center py-12">
        <Receipt className="h-16 w-16 text-slate-300 mx-auto mb-4" /> {/* ✅ Icon change */}
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No transactions found</h3> {/* ✅ Text change */}
        <p className="text-slate-500">
          No transactions match "<span className="font-medium">{searchQuery}</span>" {/* ✅ Text change */}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="mt-6 text-center">
          <Button 
            onClick={newTransaction.onOpen} 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className='h-5 w-5 mr-2'/>
            Create Your First Transaction
          </Button>
        </div>
    </div>
  );
};