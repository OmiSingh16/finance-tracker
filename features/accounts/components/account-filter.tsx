'use client';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AccountFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const filterOptions = [
  { value: 'all', label: 'All Accounts' },
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit card', label: 'Credit Card' },
];

export const AccountFilter = ({ value, onChange }: AccountFilterProps) => {
  const currentLabel = filterOptions.find(opt => opt.value === value)?.label || 'All Accounts';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 border-slate-200 rounded-xl">
          <Filter className="h-4 w-4 mr-2" />
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        {filterOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};