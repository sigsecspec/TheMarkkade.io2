
import React, { useState, useEffect, useMemo } from 'react';
import { SYMBOLS, SPIN_DURATION } from '../constants';
import { Symbol } from '../types';

interface ReelProps {
  finalSymbol: Symbol;
  isSpinning: boolean;
  reelIndex: number;
}

const Reel: React.FC<ReelProps> = ({ finalSymbol, isSpinning, reelIndex }) => {
  const [position, setPosition] = useState(0);

  const extendedSymbols = useMemo(() => {
    return [...SYMBOLS, ...SYMBOLS, ...SYMBOLS, ...SYMBOLS, ...SYMBOLS];
  }, []);

  useEffect(() => {
    if (isSpinning) {
      const finalSymbolIndex = SYMBOLS.indexOf(finalSymbol);
      // Target a symbol in the middle of the extended list for a better spinning effect
      const targetPosition = (SYMBOLS.length * 3) + finalSymbolIndex;
      setPosition(-targetPosition * 100); // 100 is height of each symbol
    }
  }, [isSpinning, finalSymbol, extendedSymbols.length]);

  const transitionDuration = SPIN_DURATION / 1000 + reelIndex * 0.2; // Stagger reels slightly

  return (
    <div className="w-20 h-24 md:w-32 md:h-36 bg-gray-900 border-2 border-fuchsia-500 rounded-lg overflow-hidden flex items-center justify-center inset-shadow">
      <div
        className="transition-transform duration-[2500ms]"
        style={{
          transform: `translateY(${position}px)`,
          transitionTimingFunction: `cubic-bezier(0.25, 0.1, 0.25, 1)`,
          transitionDuration: `${transitionDuration}s`,
        }}
      >
        {extendedSymbols.map((symbol, i) => (
          <div key={i} className="w-20 h-24 md:w-32 md:h-36 text-5xl md:text-7xl flex items-center justify-center">
            {symbol}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reel;
