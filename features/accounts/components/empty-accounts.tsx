'use client';
import { Landmark, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';

interface EmptyAccountsProps {
  searchQuery?: string;
}

export const EmptyAccounts = ({ searchQuery }: EmptyAccountsProps) => {
  const newAccount = useNewAccount();

  if (searchQuery) {
    return (
      <div className="text-center py-12">
        <Landmark className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No accounts found</h3>
        <p className="text-slate-500">
          No accounts match "<span className="font-medium">{searchQuery}</span>"
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Landmark className="h-16 w-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-700 mb-2">No accounts yet</h3>
      <p className="text-slate-500 mb-6">Create your first account to get started</p>
      <Button
        onClick={newAccount.onOpen}
        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create First Account
      </Button>
    </div>
  );
};