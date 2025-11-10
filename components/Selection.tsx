// ye generic select bulk delete ke liye


'use client';
import { Checkbox } from '@/components/ui/checkbox';

interface SelectionProps { // ✅ Generic interface
  itemId: string; // ✅ Generic prop name
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const Selection = ({ // ✅ Generic component name
  itemId,
  isSelected,
  onToggle
}: SelectionProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle(itemId);
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


// bas accunts page me ye change kro 
{/* <Selection
  itemId={account.id} // ✅ account.id use karo
  isSelected={isSelected(account.id)}
  onToggle={toggleSelection}
/> */}

//  aur categories me ye 

{/* <Selection
  itemId={category.id} // ✅ category.id use karo  
  isSelected={isSelected(category.id)}
  onToggle={toggleSelection}
/> */}