import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface IntroScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue, onBack }) => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 max-w-xl mx-auto">
      <div className="w-full">
        {/* Editorial Index */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-white/50 uppercase">
          <span>01</span>
          <span aria-hidden="true">·</span>
          <span>DISCOVER</span>
        </div>

        {/* Heading */}
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F5F3EE] tracking-tight leading-tight mb-4">
          Before we build it... <br />
          <span className="text-white/70">we want to hear from you.</span>
        </h2>

        {/* Body Text */}
        <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-6 font-normal">
          We’re exploring several product categories for a new brand launched from Pakistan with global ambitions.
        </p>

        {/* Pillar Card Checklist */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 space-y-3.5 mb-8">
          <p className="text-xs uppercase font-mono tracking-wider text-white/50">
            Your answers will help us understand:
          </p>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-white/90 shrink-0 mt-0.5" />
            <span className="text-sm text-white/90">What people actually want in daily life</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-white/90 shrink-0 mt-0.5" />
            <span className="text-sm text-white/90">What products they would genuinely spend money on</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-white/90 shrink-0 mt-0.5" />
            <span className="text-sm text-white/90">What price point feels fair and reasonable</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-white/90 shrink-0 mt-0.5" />
            <span className="text-sm text-white/90">Which concept deserves a real physical launch first</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onContinue}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 text-sm sm:text-base font-semibold text-[#0B0B0B] bg-[#F5F3EE] hover:bg-white rounded-xl transition-all duration-200 active:scale-[0.99] min-h-[48px] cursor-pointer shadow-md shadow-white/5"
          >
            <span>LET&apos;S GO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onBack}
            className="px-5 py-3 text-xs sm:text-sm font-medium text-white/60 hover:text-white rounded-xl transition-colors min-h-[48px] cursor-pointer"
          >
            Back
          </button>
        </div>

        {/* Confidentiality note */}
        <div className="flex items-center justify-center gap-2 text-xs text-white/40 mt-6 font-mono text-center">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent consumer research by ZULF (SMC-PRIVATE) LIMITED</span>
        </div>
      </div>
    </div>
  );
};
