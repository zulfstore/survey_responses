import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Share2, MessageCircle, Copy, Check, BarChart3, ArrowRight } from 'lucide-react';
import { ConceptId } from '../types/survey';
import { CONCEPTS } from '../data/concepts';

interface CompletionScreenProps {
  finalChoice: ConceptId | '';
  onViewInsights: () => void;
  onRestart: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  finalChoice,
  onViewInsights,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti once on mount
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5F3EE', '#D4AF37', '#38BDF8', '#FB923C', '#4ADE80'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const shareUrl = window.location.href;
  const shareText = `I just completed the ZULF Brand Lab survey. Help them decide what brand to launch next 👇\n${shareUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ZULF BRAND LAB',
          text: 'Help decide which consumer brand launches next in Pakistan, UAE & UK!',
          url: shareUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const chosenBrand = finalChoice ? CONCEPTS[finalChoice] : null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 max-w-xl mx-auto text-center">
      {/* Animated Check Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-xl shadow-white/5 mx-auto">
        <CheckCircle2 className="w-10 h-10 text-[#F5F3EE]" />
      </div>

      {/* Editorial Index */}
      <div className="flex items-center justify-center gap-2 mb-3 text-xs font-mono tracking-widest text-white/50 uppercase">
        <span>05</span>
        <span aria-hidden="true">·</span>
        <span>VALIDATION COMPLETE</span>
      </div>

      {/* Main Headline */}
      <h2 className="font-display font-bold text-4xl sm:text-5xl text-[#F5F3EE] tracking-tight mb-3">
        YOU DID IT.
      </h2>

      {/* Subheadline */}
      <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-6 font-normal">
        Your answers are now part of our brand-building process.
      </p>

      {/* Chosen Brand Badge if present */}
      {chosenBrand && (
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 max-w-md w-full mb-6 text-left">
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-1">
            Your Top Pick For Real Launch
          </div>
          <div className="text-lg font-bold text-white flex items-center justify-between">
            <span>{chosenBrand.name}</span>
            <span className="text-xs font-mono text-white/50 font-normal">{chosenBrand.category}</span>
          </div>
          <p className="text-xs text-white/60 mt-1 italic">
            &ldquo;{chosenBrand.tagline}&rdquo;
          </p>
        </div>
      )}

      {/* Thank you note */}
      <p className="text-sm text-white/60 max-w-md mb-8">
        Thank you for helping ZULF build something people actually want. Your response has been securely recorded.
      </p>

      {/* Share Actions */}
      <div className="w-full space-y-3 mb-8">
        <button
          onClick={handleWhatsAppShare}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm sm:text-base font-semibold text-[#0B0B0B] bg-[#F5F3EE] hover:bg-white rounded-xl transition-all duration-200 active:scale-[0.99] min-h-[48px] cursor-pointer shadow-md shadow-white/5"
        >
          <MessageCircle className="w-5 h-5 text-emerald-700" />
          <span>SHARE ON WHATSAPP</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE THIS SURVEY ↗</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Insights Portal Link */}
      <div className="pt-6 border-t border-white/8 w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <button
          onClick={onViewInsights}
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-medium transition-colors cursor-pointer py-1"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>View Market Validation Results</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          onClick={onRestart}
          className="hover:text-white transition-colors cursor-pointer py-1"
        >
          Take Survey Again
        </button>
      </div>

      {/* Corporate Stamp */}
      <div className="mt-8 text-[11px] font-mono tracking-wider text-white/30 uppercase">
        ZULF (SMC-PRIVATE) LIMITED
      </div>
    </div>
  );
};
