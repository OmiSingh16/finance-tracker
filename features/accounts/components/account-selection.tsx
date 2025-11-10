'use client';
import { Checkbox } from '@/components/ui/checkbox';

interface AccountSelectionProps {
  accountId: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const AccountSelection = ({
  accountId,
  isSelected,
  onToggle
}: AccountSelectionProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle(accountId);
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