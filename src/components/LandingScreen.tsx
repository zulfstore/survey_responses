import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
  onExploreAdmin: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart, onExploreAdmin }) => {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between items-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden text-center">
      {/* Ambient background aura (subtle, non-neon, dark luxury aesthetic) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-b from-white/6 to-transparent rounded-full blur-3xl opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 w-[380px] h-[380px] bg-white/[0.02] rounded-full blur-3xl"
      />

      {/* Top spacer */}
      <div />

      {/* Hero content container */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Lab Subtitle Identifier */}
        <div className="flex items-center gap-2 mb-5 text-xs font-mono tracking-widest text-white/50 uppercase">
          <span>Consumer Market Validation</span>
          <span aria-hidden="true">·</span>
          <span>Pakistan & Beyond</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[#F5F3EE] tracking-tight leading-[1.08] mb-6 balance">
          HELP US BUILD THE NEXT BRAND.
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-white/70 max-w-lg mb-8 leading-relaxed font-normal">
          We’re testing a few real business ideas. Your answers will directly determine which brand we launch first in Pakistan, UAE, and the UK.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-[#0B0B0B] bg-[#F5F3EE] hover:bg-white rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-white/5 min-h-[52px] min-w-[240px] cursor-pointer"
        >
          <span>START THE EXPERIENCE</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Time estimate & reassurance */}
        <div className="flex items-center gap-2 text-xs text-white/45 mt-4 tracking-wide font-mono">
          <span>2–4 minutes</span>
          <span aria-hidden="true">·</span>
          <span>Your opinion matters</span>
          <span aria-hidden="true">·</span>
          <span>No right or wrong answers</span>
        </div>

        {/* Concept Preview Indicators */}
        <div className="mt-12 pt-8 border-t border-white/8 w-full max-w-lg grid grid-cols-5 gap-2 text-left">
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono block text-white/40">01</span>
            <span className="text-xs font-medium text-white/80 block truncate">RYVEN</span>
            <span className="text-[10px] text-white/40 block truncate">Grooming</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono block text-white/40">02</span>
            <span className="text-xs font-medium text-white/80 block truncate">KĀRVO</span>
            <span className="text-[10px] text-white/40 block truncate">Woodcraft</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono block text-white/40">03</span>
            <span className="text-xs font-medium text-white/80 block truncate">CAR CARE</span>
            <span className="text-[10px] text-white/40 block truncate">Auto Detail</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono block text-white/40">04</span>
            <span className="text-xs font-medium text-white/80 block truncate">PACKAGING</span>
            <span className="text-[10px] text-white/40 block truncate">Sellers</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono block text-white/40">05</span>
            <span className="text-xs font-medium text-white/80 block truncate">PROBLEMS</span>
            <span className="text-[10px] text-white/40 block truncate">Everyday</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl text-xs text-white/40 border-t border-white/5 gap-3">
        <div className="flex items-center gap-2">
          <span>ZULF (SMC-PRIVATE) LIMITED</span>
          <span aria-hidden="true">·</span>
          <span>Brand Incubator</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onExploreAdmin}
            className="hover:text-white/80 transition-colors underline underline-offset-4 cursor-pointer"
          >
            Research Portal
          </button>
          <span>Confidential Research</span>
        </div>
      </footer>
    </div>
  );
};
