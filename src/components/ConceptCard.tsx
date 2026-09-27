import React, { useState } from 'react';
import { ConceptInfo, ConceptId } from '../types/survey';
import { Check, Info, Sparkles, Box, Scissors, Trees, Car, PackageCheck, Lightbulb } from 'lucide-react';

interface ConceptCardProps {
  concept: ConceptInfo;
  isSelected?: boolean;
  onSelect?: () => void;
  selectionType?: 'radio' | 'checkbox' | 'none';
  showDetailsButton?: boolean;
  compact?: boolean;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  concept,
  isSelected = false,
  onSelect,
  selectionType = 'radio',
  showDetailsButton = true,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Concept-specific abstract minimalist icon
  const renderIcon = () => {
    switch (concept.id) {
      case 'ryven':
        return <Scissors className="w-5 h-5 text-[#D4AF37]" />;
      case 'karvo':
        return <Trees className="w-5 h-5 text-[#C89666]" />;
      case 'carcare':
        return <Car className="w-5 h-5 text-[#38BDF8]" />;
      case 'packaging':
        return <PackageCheck className="w-5 h-5 text-[#FB923C]" />;
      case 'problemsolvers':
        return <Lightbulb className="w-5 h-5 text-[#4ADE80]" />;
      default:
        return <Box className="w-5 h-5 text-white/80" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      role={onSelect ? 'button' : 'region'}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative text-left rounded-2xl p-4 sm:p-5 transition-all duration-200 border cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        isSelected
          ? 'bg-white/[0.08] border-white/50 shadow-lg shadow-white/5'
          : 'bg-[#141414]/80 hover:bg-[#1A1A1A] border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top row: Category & Selector Indicator */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/8 shrink-0">
            {renderIcon()}
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest text-white/50 uppercase block">
              {concept.category}
            </span>
          </div>
        </div>

        {selectionType !== 'none' && (
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
              isSelected
                ? 'bg-white text-black border-white'
                : 'border-white/25 bg-black/40 group-hover:border-white/40'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        )}
      </div>

      {/* Brand Title */}
      <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F5F3EE] tracking-tight mb-1">
        {concept.name}
      </h3>

      {/* Tagline */}
      <p className="text-xs sm:text-sm font-medium text-white/90 mb-2 italic">
        &ldquo;{concept.tagline}&rdquo;
      </p>

      {/* Description */}
      <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-3">
        {concept.description}
      </p>

      {/* Potential Products Pills (Clean list) */}
      {!compact && (
        <div className="pt-2 border-t border-white/5">
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2">
            Potential Products
          </div>
          <div className="flex flex-wrap gap-1.5">
            {concept.potentialProducts.slice(0, isExpanded ? undefined : 3).map((prod) => (
              <span
                key={prod}
                className="text-xs text-white/70 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5"
              >
                {prod}
              </span>
            ))}
            {concept.potentialProducts.length > 3 && !isExpanded && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                className="text-xs text-white/40 hover:text-white/80 px-2 py-1 transition-colors"
              >
                +{concept.potentialProducts.length - 3} more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
