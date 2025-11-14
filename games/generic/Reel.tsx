import React, { useState, useEffect, useMemo } from 'react';

interface ReelProps {
  finalSymbol: string;
  isSpinning: boolean;
  reelIndex: number;
  symbols: string[]; // Receive symbols as a prop
  spinDuration: number;
}

const Reel: React.FC<ReelProps> = ({ finalSymbol, isSpinning, reelIndex, symbols, spinDuration }) => {
  const [position, setPosition] = useState(0);
  const symbolHeight = 96; // h-24 in Tailwind

  const extendedSymbols = useMemo(() => {
    // Create a long, shuffled list of symbols for a better visual spin
    let extended: string[] = [];
    for (let i = 0; i < 20; i++) {
        extended = extended.concat([...symbols].sort(() => Math.random() - 0.5));
    }
    return extended;
  }, [symbols]);

  useEffect(() => {
    if (isSpinning) {
      // Reset position to the top before spinning for a seamless loop
      setPosition(0);
      const finalSymbolIndex = symbols.indexOf(finalSymbol);
      const targetPosition = (extendedSymbols.length - symbols.length) + finalSymbolIndex;
      
      // Use a timeout to apply the final position after a short delay, allowing the reset to render first
      setTimeout(() => {
         setPosition(-targetPosition * symbolHeight);
      }, 50);

    }
  }, [isSpinning, finalSymbol, extendedSymbols.length, symbols]);

  const transitionDuration = spinDuration / 1000 + reelIndex * 0.2; // Stagger reels slightly

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
