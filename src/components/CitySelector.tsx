import React, { useState } from 'react';
import { PAKISTAN_MAJOR_CITIES } from '../data/concepts';
import { Search, MapPin, Check } from 'lucide-react';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const filteredCities = PAKISTAN_MAJOR_CITIES.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const topCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar'];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search city (e.g. Lahore, Karachi, Multan)..."
          className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 min-h-[48px]"
        />
      </div>

      {/* Quick Select Top Cities */}
      {!searchTerm && (
        <div>
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-2">
            Popular Cities
          </span>
          <div className="flex flex-wrap gap-2">
            {topCities.map((city) => {
              const isSelected = value === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => onChange(city)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-[#141414] text-white/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <MapPin className="w-3 h-3 opacity-60" />
                  <span>{city}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scrollable Cities List */}
      <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 border border-white/5 rounded-xl p-1 bg-black/20">
        {filteredCities.map((city) => {
          const isSelected = value === city;
          return (
            <button
              key={city}
              type="button"
              onClick={() => {
                onChange(city);
                setShowCustom(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                isSelected
                  ? 'bg-white/10 text-white font-medium border border-white/20'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{city}</span>
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </button>
          );
        })}

        {filteredCities.length === 0 && (
          <div className="p-4 text-center text-xs text-white/40">
            No pre-listed city found. Enter your city below.
          </div>
        )}
      </div>

      {/* Custom City Text Input */}
      <div className="pt-2 border-t border-white/8">
        <label className="text-xs text-white/50 block mb-1.5 font-mono">
          Don&apos;t see your city? Type it here:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customInput.trim()) {
                e.preventDefault();
                onChange(customInput.trim());
              }
            }}
            placeholder="Enter custom city..."
            className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 min-h-[44px]"
          />
          <button
            type="button"
            onClick={() => {
              if (customInput.trim()) {
                onChange(customInput.trim());
              }
            }}
            disabled={!customInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs font-semibold text-white transition-colors min-h-[44px] cursor-pointer"
          >
            Set
          </button>
        </div>
      </div>

      {/* Current selection summary */}
      {value && (
        <div className="text-xs text-white/60 font-mono flex items-center gap-1.5 pt-1">
          <span className="text-white/40">Selected:</span>
          <span className="text-white font-medium underline underline-offset-2">{value}</span>
        </div>
      )}
    </div>
  );
};
