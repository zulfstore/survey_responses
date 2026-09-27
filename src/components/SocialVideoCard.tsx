import React from 'react';
import { ConceptId } from '../types/survey';
import { CONCEPTS } from '../data/concepts';
import { Play, Eye, Flame, Check } from 'lucide-react';

interface SocialVideoCardProps {
  conceptId: ConceptId;
  isSelected: boolean;
  onSelect: () => void;
  type?: 'radio' | 'checkbox';
}

export const SocialVideoCard: React.FC<SocialVideoCardProps> = ({
  conceptId,
  isSelected,
  onSelect,
  type = 'radio',
}) => {
  const concept = CONCEPTS[conceptId];

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        isSelected
          ? 'bg-white/[0.08] border-white/50 shadow-md shadow-white/5'
          : 'bg-[#141414] hover:bg-[#1A1A1A] border-white/10 hover:border-white/25'
      }`}
    >
      {/* Video Simulation Mockup Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
            <Play className="w-3 h-3 text-white fill-white ml-0.5" />
          </div>
          <span className="text-xs font-mono font-medium tracking-wider text-white/60 uppercase">
            {concept.name}
          </span>
        </div>

        <div
          className={`w-5 h-5 rounded-${type === 'radio' ? 'full' : 'md'} flex items-center justify-center border transition-all ${
            isSelected
              ? 'bg-white text-black border-white'
              : 'border-white/20 bg-black/40'
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {/* Video Hook Headline */}
      <h4 className="text-base sm:text-lg font-semibold text-[#F5F3EE] tracking-tight mb-1.5 leading-snug">
        &ldquo;{concept.tiktokHook}&rdquo;
      </h4>

      {/* Hook Description / Subtitle */}
      <p className="text-xs text-white/60 leading-relaxed">
        {concept.hookSubtitle}
      </p>

      {/* Metric mock pill */}
      <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-white/5 text-[11px] font-mono text-white/40">
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Trending Hook</span>
        </span>
        <span aria-hidden="true">·</span>
        <span>Short Form Video</span>
      </div>
    </div>
  );
};
