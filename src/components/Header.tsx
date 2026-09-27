import React from 'react';
import { ShieldCheck, BarChart3, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onRestart?: () => void;
  showAdminButton?: boolean;
  isAdminOpen?: boolean;
  stepIndicator?: string;
  sectionName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onRestart,
  showAdminButton = true,
  isAdminOpen = false,
  stepIndicator,
  sectionName,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#0B0B0B]/85 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-4 sm:px-6">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onRestart) onRestart();
          }}
          className="group flex items-center gap-2 text-left"
        >
          <span className="font-display font-bold text-base sm:text-lg tracking-wider text-[#F5F3EE] group-hover:text-white transition-colors">
            ZULF
          </span>
          <span className="text-xs text-white/40 tracking-widest font-mono uppercase">
            BRAND LAB
          </span>
        </a>
      </div>

      {/* Zone 2: Section Status / Stage Breadcrumb */}
      {sectionName && (
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono tracking-wider text-white/50">
          <span className="text-white/80 font-medium">{sectionName}</span>
          {stepIndicator && (
            <>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span className="tabular-nums text-white/50">{stepIndicator}</span>
            </>
          )}
        </div>
      )}

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2">
        {onRestart && (
          <button
            onClick={onRestart}
            title="Start over"
            aria-label="Restart survey"
            className="p-2 text-white/50 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {showAdminButton && (
          <button
            onClick={onOpenAdmin}
            aria-label={isAdminOpen ? 'Close Dashboard' : 'Market Research Dashboard'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all min-h-[44px] ${
              isAdminOpen
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {isAdminOpen ? 'Exit Lab' : 'Research Portal'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
