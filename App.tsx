import React, { useState, useEffect } from 'react';
import { gameThemes } from './game-themes';

const App: React.FC = () => {
  const [currency, setCurrency] = useState({ kash: 1000, coins: 50000 });

  useEffect(() => {
    const savedCurrency = localStorage.getItem('themarkkade_currency');
    if (savedCurrency) {
      setCurrency(JSON.parse(savedCurrency));
    } else {
      localStorage.setItem('themarkkade_currency', JSON.stringify(currency));
    }

    const handleStorageUpdate = () => {
      const updatedCurrency = localStorage.getItem('themarkkade_currency');
      if (updatedCurrency) {
        setCurrency(JSON.parse(updatedCurrency));
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="text-white w-screen h-screen flex flex-col overflow-hidden select-none">
      {/* Top half - Display Screen */}
      <div className="h-1/2 flex flex-col items-center justify-center p-4 relative">
        {/* Currency Display */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
            <div className="currency-display font-cinzel">
                <span className="text-yellow-400 text-lg mr-2">Ka$h:</span>
                <span className="text-xl font-bold tracking-wider">{formatNumber(currency.kash)}</span>
            </div>
            <div className="currency-display font-cinzel">
                <span className="text-gray-400 text-lg mr-2">¢oins:</span>
                <span className="text-xl font-bold tracking-wider">{formatNumber(currency.coins)}</span>
            </div>
        </div>

        <div className="text-center z-10 flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-cinzel gold-text tracking-wider">
                TheMarkkade.io
            </h1>
            <p className="mt-4 text-sm md:text-base text-yellow-400 tracking-widest font-cinzel opacity-80">A CASINO BUILT FOR FOLDABLES</p>
        </div>
      </div>
      
      {/* Divider */}
      <div className="flex justify-center items-center px-4 my-2">
        <div className="w-full max-w-xl divider-glow"></div>
      </div>

      {/* Bottom half - Game Selection */}
      <div className="h-1/2 flex flex-col items-center p-4">
        <h2 className="text-xl md:text-3xl mb-6 md:mb-8 tracking-widest font-cinzel gold-text-glow">SELECT A GAME</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-md md:max-w-4xl overflow-y-auto pr-2">
          {gameThemes.map((game, index) => (
            <a
              key={index}
              href={game.status === 'Play Now' ? `/game.html?theme=${game.id}` : '#'}
              className={`game-card rounded-lg p-4 text-center group ${game.status !== 'Play Now' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={(e) => game.status !== 'Play Now' && e.preventDefault()}
            >
              <p className="text-4xl md:text-5xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">{game.icon}</p>
              <p className="font-bold text-sm md:text-base text-white mt-2 font-cinzel tracking-wider">{game.name}</p>
              <p className={`text-xs md:text-sm mt-1 ${game.status === 'Play Now' ? 'text-yellow-400' : 'text-gray-400'}`}>{game.status}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
