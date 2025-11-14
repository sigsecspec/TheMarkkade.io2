import React, { useState, useEffect, useMemo } from 'react';
import { SYMBOLS, SPIN_DURATION } from './constants';
import { Symbol } from './types';

interface ReelProps {
  finalSymbol: Symbol;
  isSpinning: boolean;
  reelIndex: number;
}

const Reel: React.FC<ReelProps> = ({ finalSymbol, isSpinning, reelIndex }) => {
  const [position, setPosition] = useState(0);
  const symbolHeight = 96; // h-24 in Tailwind

  const extendedSymbols = useMemo(() => {
    // Create a long, shuffled list of symbols for a better visual spin
    let symbols: Symbol[] = [];
    for (let i = 0; i < 20; i++) {
        symbols = symbols.concat([...SYMBOLS].sort(() => Math.random() - 0.5));
    }
    return symbols;
  }, []);

  useEffect(() => {
    if (isSpinning) {
      // Reset position to the top before spinning for a seamless loop
      setPosition(0);
      const finalSymbolIndex = SYMBOLS.indexOf(finalSymbol);
      const targetPosition = (extendedSymbols.length - SYMBOLS.length) + finalSymbolIndex;
      
      // Use a timeout to apply the final position after a short delay, allowing the reset to render first
      setTimeout(() => {
         setPosition(-targetPosition * symbolHeight);
      }, 50);

    }
  }, [isSpinning, finalSymbol, extendedSymbols.length]);

  const transitionDuration = SPIN_DURATION / 1000 + reelIndex * 0.2; // Stagger reels slightly

  return (
    <div className="w-20 h-24 md:w-24 bg-black/20 border-2 border-yellow-800 rounded-lg overflow-hidden flex items-center justify-center shadow-inner shadow-black/50">
      <div
        style={{
          transform: `translateY(${position}px)`,
          transition: isSpinning ? `transform ${transitionDuration}s cubic-bezier(0.3, 1, 0.4, 1)` : 'none',
        }}
      >
        {extendedSymbols.map((symbol, i) => (
          <div key={i} className="w-20 h-24 md:w-24 text-5xl md:text-6xl flex items-center justify-center">
            {symbol}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reel;
