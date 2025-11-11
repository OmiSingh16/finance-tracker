'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { Plus, CreditCard, Wallet, Landmark, Building, Loader2 } from 'lucide-react';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { AccountSearch } from '@/features/accounts/components/account-search';
import { AccountFilter } from '@/features/accounts/components/account-filter';
import { useAccountFilters } from '@/features/accounts/hooks/use-account-filters';
import { AccountSelection } from '@/features/accounts/components/account-selection';
import { BulkActions } from '@/features/accounts/components/bulk-actions';
import { useAccountSelection } from '@/features/accounts/hooks/use-account-selection';
import { EmptyAccounts } from '@/features/accounts/components/empty-accounts';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'; // ✅ ADD THIS



const AccountPage = () => {
  const newAccount = useNewAccount();
  const openAccount = useOpenAccount();
  const accountsQuery = useGetAccounts();
  const transactionsQuery = useGetTransactions(); // ✅ ADD TRANSACTIONS QUERY
  
  const accounts = accountsQuery.data || [];
  const transactions = transactionsQuery.data || [];


  // ✅ CALCULATE TOTAL BALANCE
  const totalBalance = accounts.reduce((sum, account) => {
    const balance = parseInt(account.balance || '0');
    return sum + balance;
  }, 0);

  // ✅ CALCULATE THIS MONTH CHANGE
  const getThisMonthChange = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const income = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return income - expense;
  };

  const thisMonthChange = getThisMonthChange();

  // Filter hook
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filteredAccounts
  } = useAccountFilters(accounts);

  // Selection hook
  const {
    selectedIds,
    toggleSelection,
    clearSelection,
    isSelected,
    hasSelection
  } = useAccountSelection();

  // Loading state - DONO QUERIES KA LOADING CHECK KARO
  if (accountsQuery.isLoading || transactionsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6 -mt-8 rounded-t-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Accounts</h1>
          <p className="text-slate-600">Manage your bank accounts and track balances</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  // Helper function to get icon and color based on account type
  const getAccountIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'savings':
        return { icon: <Landmark className="h-5 w-5" />, color: 'bg-blue-500' };
      case 'current':
        return { icon: <Building className="h-5 w-5" />, color: 'bg-green-500' };
      case 'cash':
        return { icon: <Wallet className="h-5 w-5" />, color: 'bg-orange-500' };
      case 'credit card':
        return { icon: <CreditCard className="h-5 w-5" />, color: 'bg-red-500' };
      default:
        return { icon: <Landmark className="h-5 w-5" />, color: 'bg-gray-500' };
    }
  };

  // Handler functions
  const handleCardClick = (accountId: string) => {
    openAccount.onOpen(accountId);
  };

  const handleEditClick = (e: React.MouseEvent, accountId: string) => {
    e.stopPropagation();
    openAccount.onOpen(accountId);
  };

  const handleViewClick = (e: React.MouseEvent, accountId: string) => {
    e.stopPropagation();
  };

  return(
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6 -mt-8 rounded-t-sm">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Accounts</h1>
        <p className="text-slate-600">Manage your bank accounts and track balances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-l-4 border-l-blue-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Total Balance</p>
                <p className="text-2xl font-bold text-slate-800">
                  ₹{totalBalance.toLocaleString()} {/* ✅ NOW DYNAMIC */}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-green-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Total Accounts</p>
                <p className="text-2xl font-bold text-slate-800">{accounts.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-purple-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">This Month</p>
                <p className={`text-2xl font-bold ${thisMonthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {thisMonthChange >= 0 ? '+' : ''}₹{Math.abs(thisMonthChange).toLocaleString()} {/* ✅ NOW DYNAMIC */}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Landmark className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REST OF YOUR CODE SAME AS BEFORE */}
      {/* Main Accounts Card */}
       <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200'>
          <div className="flex-1">
            <CardTitle className='text-2xl font-bold text-slate-800'>
              Your Accounts
             </CardTitle>
             <p className="text-slate-600 mt-1">All your bank accounts in one place</p>
            
             {/* Bulk Actions */}
            <BulkActions 
              selectedIds={selectedIds}
               onClearSelection={clearSelection}
            />
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
               <div className="w-full sm:w-64">
                <AccountSearch
                  value={searchQuery}
                   onChange={setSearchQuery}
                />
              </div>
              <AccountFilter
                value={typeFilter}
                onChange={setTypeFilter}
              />
            </div>
          </div>
          
          <Button 
            onClick={newAccount.onOpen} 
            size='lg'
            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl"
          >
            <Plus className='h-5 w-5 mr-2'/>
            Add New Account
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {/* Accounts Grid */}
          {filteredAccounts.length === 0 ? (
            <EmptyAccounts searchQuery={searchQuery} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAccounts.map((account) => {
                const { icon, color } = getAccountIcon(account.type);
                return (
                  <Card 
                    key={account.id} 
                    // onClick={() => handleCardClick(account.id)}
                    className="group cursor-pointer border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-xl relative"
                  >
                    {/* Selection Checkbox */}
                    <AccountSelection
                      accountId={account.id}
                      isSelected={isSelected(account.id)}
                      onToggle={toggleSelection}
                    />
                    
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${color}`}>
                          {icon}
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-700">
                          {account.type}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-slate-800 mb-1 text-lg">
                        {account.name}
                      </h3>
                      <p className="text-2xl font-bold text-slate-900 mb-3">
                        ₹{account.balance}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={(e) => handleViewClick(e, account.id)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={(e) => handleEditClick(e, account.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* Add New Account Card */}
              <Card 
                onClick={newAccount.onOpen}
                className="group cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center min-h-[180px] bg-slate-50/50 rounded-xl"
              >
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300 inline-block mb-3">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-slate-700 group-hover:text-blue-700">
                    Add New Account
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
