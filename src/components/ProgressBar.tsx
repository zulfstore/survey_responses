import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  sectionName: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  sectionName,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)));
  const formattedCurrent = currentStep < 10 ? `0${currentStep}` : `${currentStep}`;
  const formattedTotal = totalSteps < 10 ? `0${totalSteps}` : `${totalSteps}`;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2.5">
      <div className="flex items-center justify-between text-xs text-white/50 mb-1.5 font-mono">
        <span className="text-white/80 tracking-wider font-semibold uppercase">
          {sectionName}
        </span>
        <span className="tabular-nums tracking-widest text-white/60">
          Question {formattedCurrent} / {formattedTotal}
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F5F3EE] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
