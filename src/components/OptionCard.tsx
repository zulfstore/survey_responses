import React from 'react';
import { Check } from 'lucide-react';

interface OptionCardProps {
  label: string;
  sublabel?: string;
  isSelected: boolean;
  onSelect: () => void;
  type?: 'radio' | 'checkbox';
  disabled?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  sublabel,
  isSelected,
  onSelect,
  type = 'radio',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`w-full text-left p-4 sm:p-4.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 min-h-[52px] select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        isSelected
          ? 'bg-white/[0.09] border-white/50 text-white shadow-sm'
          : 'bg-[#141414] hover:bg-[#1C1C1C] border-white/10 hover:border-white/20 text-white/80'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div className="flex-1 min-w-0 pr-2">
        <span className="text-sm sm:text-base font-medium block truncate">
          {label}
        </span>
        {sublabel && (
          <span className="text-xs text-white/50 block mt-0.5 font-normal">
            {sublabel}
          </span>
        )}
      </div>

      <div
        className={`w-5 h-5 rounded-${type === 'radio' ? 'full' : 'md'} flex items-center justify-center border transition-all shrink-0 ${
          isSelected
            ? 'bg-white text-black border-white'
            : 'border-white/20 bg-black/30'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </button>
  );
};
