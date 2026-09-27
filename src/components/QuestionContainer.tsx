import React from 'react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionContainerProps {
  sectionLabel: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  helperText?: string;
  errorMessage?: string;
  onNext: () => void;
  onBack: () => void;
  canNext?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
}

export const QuestionContainer: React.FC<QuestionContainerProps> = ({
  sectionLabel,
  stepNumber,
  totalSteps,
  title,
  subtitle,
  helperText,
  errorMessage,
  onNext,
  onBack,
  canNext = true,
  nextLabel = 'CONTINUE →',
  children,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-between min-h-[calc(100vh-10rem)]">
      {/* Top Header Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full mb-6"
      >
        <div className="flex items-center gap-2 mb-2 text-xs font-mono tracking-widest text-white/50 uppercase">
          <span>{sectionLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{stepNumber} of {totalSteps}</span>
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F5F3EE] tracking-tight leading-snug mb-2 balance">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}

        {helperText && (
          <p className="text-xs text-white/45 mt-1 font-mono">
            {helperText}
          </p>
        )}
      </motion.div>

      {/* Interactive Main Body Content */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.05, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full my-auto py-2"
      >
        {children}
      </motion.div>

      {/* Bottom Sticky Action Area with Thumb Target */}
      <div className="w-full pt-6 mt-6 border-t border-white/8">
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 mb-3 text-xs sm:text-sm text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{errorMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Previous question"
            className="px-4 py-3.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNext}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 min-h-[48px] cursor-pointer ${
              canNext
                ? 'bg-[#F5F3EE] text-[#0B0B0B] hover:bg-white active:scale-[0.99] shadow-md shadow-white/5'
                : 'bg-white/10 text-white/40 border border-white/5 hover:bg-white/15'
            }`}
          >
            <span>{nextLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

