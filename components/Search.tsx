'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps { // ✅ Interface name change
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ // ✅ Component name change
  value,
  onChange,
  placeholder = "Search..."
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 h-10 border-slate-200 focus:border-blue-500 rounded-xl"
      />
    </div>
  );
};

// for account 
{/* <Search
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search accounts..." // ✅ Custom placeholder
/> */}

//  for category

{/* <Search
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search categories..." // ✅ Custom placeholder
/> */}