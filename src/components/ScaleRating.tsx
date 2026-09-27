import React from 'react';

interface ScaleRatingProps {
  value: number | undefined;
  onChange: (val: number) => void;
  labels?: Record<number, string>;
  min?: number;
  max?: number;
}

export const ScaleRating: React.FC<ScaleRatingProps> = ({
  value,
  onChange,
  labels = {
    1: 'Not interested',
    2: 'Slightly interested',
    3: 'Maybe',
    4: 'Interested',
    5: 'Very interested',
  },
  min = 1,
  max = 5,
}) => {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full space-y-3">
      {/* 1-5 Buttons Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {points.map((point) => {
          const isSelected = value === point;
          return (
            <button
              key={point}
              type="button"
              onClick={() => onChange(point)}
              className={`h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center border font-mono transition-all duration-150 cursor-pointer select-none min-h-[48px] outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isSelected
                  ? 'bg-[#F5F3EE] text-[#0B0B0B] border-white font-bold shadow-md shadow-white/10 scale-[1.02]'
                  : 'bg-[#141414] text-white/80 border-white/10 hover:border-white/30 hover:bg-[#1E1E1E]'
              }`}
            >
              <span className="text-lg sm:text-xl font-bold">{point}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Label feedback */}
      <div className="flex items-center justify-between text-xs text-white/50 px-1 pt-1 font-mono">
        <span className="truncate">{labels[min]}</span>
        <span className="text-white/90 font-medium text-center px-2">
          {value ? labels[value] : 'Select rating (1–5)'}
        </span>
        <span className="text-right truncate">{labels[max]}</span>
      </div>
    </div>
  );
};
