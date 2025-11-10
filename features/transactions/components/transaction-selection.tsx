'use client';
import { Checkbox } from '@/components/ui/checkbox';

interface TransactionSelectionProps { // ✅ Specific interface
  transactionId: string; // ✅ Specific prop name
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const TransactionSelection = ({ // ✅ Specific component name
  transactionId, // ✅ Specific prop
  isSelected,
  onToggle
}: TransactionSelectionProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle(transactionId); // ✅ Specific prop use
  };

  return (
    <div 
      className="absolute top-3 left-3 z-10 cursor-pointer"
      onClick={handleClick}
    >
      <Checkbox
        checked={isSelected}
        className="h-5 w-5 border-2 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 pointer-events-none"
      />
    </div>
  );
};