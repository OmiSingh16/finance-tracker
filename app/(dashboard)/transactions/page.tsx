// 'use client';
// // Hooks
// import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions';
// import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transactions';
// import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
// import { useTransactionFilters } from '@/features/transactions/hooks/use-transactions-filters';
// import { useTransactionSelection } from '@/features/transactions/hooks/use-transactions-selection';

// // Components
// import { TransactionSearch } from '@/features/transactions/components/transaction-search';
// import { TransactionFilter } from '@/features/transactions/components/transaction-filter';
// import { BulkActions } from '@/features/transactions/components/bulk-actions-transaction';
// import { EmptyTransactions } from '@/features/transactions/components/empty-transactions';

// // UI Components
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Checkbox } from '@/components/ui/checkbox';

// // Icons
// import { Plus, Receipt, TrendingUp, TrendingDown, Loader2, Edit, MoreHorizontal, Calendar, User, Wallet } from 'lucide-react';


// const TransactionPage = () => {
//   const newTransaction = useNewTransaction();
//   const openTransaction = useOpenTransaction();
//   const transactionsQuery = useGetTransactions();
//   const transactions = transactionsQuery.data || [];

//   // Filter hook
//   const {
//     searchQuery,
//     setSearchQuery,
//     typeFilter,
//     setTypeFilter,
//     accountFilter,
//     setAccountFilter,
//     categoryFilter,
//     setCategoryFilter,
//     filteredTransactions
//   } = useTransactionFilters(transactions);

//   // Selection hook
//   const {
//     selectedIds,
//     toggleSelection,
//     clearSelection,
//     isSelected,
//     hasSelection
//   } = useTransactionSelection();

//   // Loading state
//   if (transactionsQuery.isLoading) {
//     return (
//       <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-50 p-6 -mt-8 rounded-t-sm">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-slate-800 mb-2">Transactions</h1>
//           <p className="text-slate-600">Loading your financial transactions...</p>
//         </div>
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
//         </div>
//       </div>
//     );
//   }

//   // Calculate stats
//   const totalIncome = transactions
//     .filter(t => t.type === 'income')
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalExpenses = transactions
//     .filter(t => t.type === 'expense')
//     .reduce((sum, t) => sum + t.amount, 0);

//   const netAmount = totalIncome - totalExpenses;

//   return(
//     <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-50 p-6 -mt-8 rounded-t-sm">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold text-slate-800 mb-2">Transactions</h1>
//             <p className="text-slate-600">Manage your financial transactions</p>
//           </div>
//           <Button 
//             onClick={newTransaction.onOpen} 
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             <Plus className='h-4 w-4 mr-2'/>
//             New Transaction
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <Card className="bg-white border-0 shadow-sm">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Total Transactions</p>
//                 <p className="text-2xl font-bold text-slate-800">{transactions.length}</p>
//               </div>
//               <Receipt className="h-8 w-8 text-blue-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white border-0 shadow-sm">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Total Income</p>
//                 <p className="text-2xl font-bold text-emerald-600">
//                   ₹{totalIncome.toLocaleString()}
//                 </p>
//               </div>
//               <TrendingUp className="h-8 w-8 text-emerald-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white border-0 shadow-sm">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Total Expenses</p>
//                 <p className="text-2xl font-bold text-rose-600">
//                   ₹{totalExpenses.toLocaleString()}
//                 </p>
//               </div>
//               <TrendingDown className="h-8 w-8 text-rose-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white border-0 shadow-sm">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">Net Amount</p>
//                 <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
//                   ₹{Math.abs(netAmount).toLocaleString()} {netAmount >= 0 ? '' : '(Loss)'}
//                 </p>
//               </div>
//               <div className={`h-8 w-8 ${netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
//                 <div className={`h-2 w-2 ${netAmount >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Table Card */}
//       <Card className="bg-white border-0 shadow-sm">
//         <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-slate-200'>
//           <div className="flex-1">
//             <CardTitle className='text-xl font-semibold text-slate-800'>
//               Transaction List
//             </CardTitle>
            
//             {/* Bulk Actions */}
//             {hasSelection && (
//               <BulkActions 
//                 selectedIds={selectedIds}
//                 onClearSelection={clearSelection}
//               />
//             )}
//           </div>
          
//           {/* Search and Filter */}
//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <div className="w-full sm:w-64">
//               <TransactionSearch
//                 value={searchQuery}
//                 onChange={setSearchQuery}
//               />
//             </div>
//             <TransactionFilter
//               value={typeFilter}
//               onChange={setTypeFilter}
//             />
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           {/* Transactions Table */}
//           {filteredTransactions.length === 0 ? (
//             <div className="p-8">
//               <EmptyTransactions searchQuery={searchQuery} />
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow className="border-b border-slate-200">
//                   <TableHead className="w-12">
//                     <Checkbox 
//                       checked={selectedIds.length === filteredTransactions.length}
//                       onCheckedChange={() => {
//                         if (selectedIds.length === filteredTransactions.length) {
//                           clearSelection();
//                         } else {
//                           // Select all logic here
//                         }
//                       }}
//                     />
//                   </TableHead>
//                   <TableHead className="font-semibold text-slate-700">Date</TableHead>
//                   <TableHead className="font-semibold text-slate-700">Payee</TableHead>
//                   <TableHead className="font-semibold text-slate-700">Amount</TableHead>
//                   <TableHead className="font-semibold text-slate-700">Type</TableHead>
//                   <TableHead className="font-semibold text-slate-700">Category</TableHead>
//                   <TableHead className="font-semibold text-slate-700">Account</TableHead>
//                   <TableHead className="font-semibold text-slate-700 w-20">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredTransactions.map((transaction) => (
//                   <TableRow 
//                     key={transaction.id} 
//                     className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
//                   >
//                     <TableCell>
//                       <Checkbox 
//                         checked={isSelected(transaction.id)}
//                         onCheckedChange={() => toggleSelection(transaction.id)}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-slate-400" />
//                         <span className="text-slate-700">
//                           {new Date(transaction.date).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <User className="h-4 w-4 text-slate-400" />
//                         <span className="font-medium text-slate-800">{transaction.payee}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <span className={`font-semibold ${
//                         transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
//                       }`}>
//                         {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         transaction.type === 'income' 
//                           ? 'bg-emerald-100 text-emerald-800' 
//                           : 'bg-rose-100 text-rose-800'
//                       }`}>
//                         {transaction.type === 'income' ? 'Income' : 'Expense'}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {transaction.categoryName || 'Uncategorized'}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Wallet className="h-4 w-4 text-slate-400" />
//                         <span className="text-slate-700">{transaction.accountName}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => openTransaction.onOpen(transaction.id)}
//                           className="h-8 w-8 p-0"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0"
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* Empty State Add Button */}
//       {filteredTransactions.length === 0 && !searchQuery && (
//         <div className="mt-6 text-center">
//           <Button 
//             onClick={newTransaction.onOpen} 
//             size="lg"
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             <Plus className='h-5 w-5 mr-2'/>
//             Create Your First Transaction
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransactionPage;


'use client';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transactions';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useTransactionFilters } from '@/features/transactions/hooks/use-transactions-filters';
import { useTransactionSelection } from '@/features/transactions/hooks/use-transactions-selection';

// Components
import { TransactionSearch } from '@/features/transactions/components/transaction-search';
import { TransactionFilter } from '@/features/transactions/components/transaction-filter';
import { BulkActions } from '@/features/transactions/components/bulk-actions-transaction';
import { EmptyTransactions } from '@/features/transactions/components/empty-transactions';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

// Icons
import { Plus, Receipt, TrendingUp, TrendingDown, Loader2, Edit, MoreHorizontal, Calendar, User, Wallet } from 'lucide-react';

type Transaction = {
  id: string;
  amount: number;
  payee: string;
  notes: string | null;
  date: Date;
  accountId: string;
  categoryId: string | null;
  userId: string;
  type: string;
  createdAt: Date | null;
  accountName: string;
  categoryName: string | null;
};

const TransactionPage = () => {
  const newTransaction = useNewTransaction();
  const openTransaction = useOpenTransaction();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  // Filter hook
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions
  } = useTransactionFilters(transactions);

  // Selection hook
  const {
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    isSelected,
    hasSelection
  } = useTransactionSelection();

  // ✅ Handle select all - FIXED
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      clearSelection();
    } else {
      const allIds = filteredTransactions.map(t => t.id);
      toggleSelectAll(allIds);
    }
  };

  // Loading state
  if (transactionsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-50 p-6 -mt-8 rounded-t-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Transactions</h1>
          <p className="text-slate-600">Loading your financial transactions...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  return(
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-50 p-6 -mt-8 rounded-t-sm">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Transactions</h1>
            <p className="text-slate-600">Manage your financial transactions</p>
          </div>
          <Button 
            onClick={newTransaction.onOpen} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className='h-4 w-4 mr-2'/>
            New Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-800">{transactions.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Income</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ₹{totalIncome.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                <p className="text-2xl font-bold text-rose-600">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-rose-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Net Amount</p>
                <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ₹{Math.abs(netAmount).toLocaleString()} {netAmount >= 0 ? '' : '(Loss)'}
                </p>
              </div>
              <div className={`h-8 w-8 ${netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                <div className={`h-2 w-2 ${netAmount >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-slate-200'>
          <div className="flex-1">
            <CardTitle className='text-xl font-semibold text-slate-800'>
              Transaction List
            </CardTitle>
            
            {/* Bulk Actions */}
            {hasSelection && (
              <BulkActions 
                selectedIds={selectedIds}
                onClearSelection={clearSelection}
              />
            )}
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <TransactionSearch
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <TransactionFilter
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Transactions Table */}
          {filteredTransactions.length === 0 ? (
            <div className="p-8">
              <EmptyTransactions searchQuery={searchQuery} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700">Payee</TableHead>
                  <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-700">Type</TableHead>
                  <TableHead className="font-semibold text-slate-700">Category</TableHead>
                  <TableHead className="font-semibold text-slate-700">Account</TableHead>
                  <TableHead className="font-semibold text-slate-700 w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox 
                        checked={isSelected(transaction.id)}
                        onCheckedChange={() => toggleSelection(transaction.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-700">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-800">{transaction.payee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {transaction.categoryName || 'Uncategorized'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-700">{transaction.accountName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openTransaction.onOpen(transaction.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPage;

