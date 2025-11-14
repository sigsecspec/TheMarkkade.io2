import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { themesById, GameTheme } from '../../game-themes';
import Reel from './Reel';

const REEL_COUNT = 5;
const SPIN_DURATION = 3000;
const BET_OPTIONS = [10, 20, 30, 40, 50];

const GenericGame: React.FC = () => {
    const [theme, setTheme] = useState<GameTheme | null>(null);
    const [currency, setCurrency] = useState({ kash: 1000, coins: 50000 });
    const [reels, setReels] = useState<string[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentBetIndex, setCurrentBetIndex] = useState(0);
    const [winAmount, setWinAmount] = useState<number | null>(null);
    const [freeSpins, setFreeSpins] = useState(0);
    const [showPayTable, setShowPayTable] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sounds = useMemo(() => {
        const audio = (src: string, volume: number = 1.0) => {
            const sound = new Audio(src);
            sound.preload = 'auto';
            sound.volume = volume;
            return sound;
        };
        return {
            click: audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2b24f63d76.mp3', 0.5),
            spin: audio('https://cdn.pixabay.com/audio/2022/03/10/audio_c3592a8a81.mp3', 0.3),
            win: audio('https://cdn.pixabay.com/audio/2022/11/17/audio_88c72a7625.mp3', 0.4),
            bonus: audio('https://cdn.pixabay.com/audio/2022/05/27/audio_338a092e46.mp3', 0.5)
        };
    }, []);

    useEffect(() => {
        sounds.spin.loop = true;
    }, [sounds]);
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const themeId = params.get('theme');
        if (themeId && themesById.has(themeId)) {
            const currentTheme = themesById.get(themeId)!;
            setTheme(currentTheme);
            setReels(Array(REEL_COUNT).fill(currentTheme.symbols[0]));
        } else {
            setError('Game theme not found. Please return to the lobby.');
        }

        const savedCurrency = localStorage.getItem('themarkkade_currency');
        if (savedCurrency) {
            setCurrency(JSON.parse(savedCurrency));
        }
    }, []);

    const playSound = useCallback((sound: keyof typeof sounds) => {
        sounds[sound].currentTime = 0;
        sounds[sound].play().catch(e => console.error(`Error playing ${sound} sound:`, e));
    }, [sounds]);

    const stopSound = useCallback((sound: keyof typeof sounds) => {
        sounds[sound].pause();
        sounds[sound].currentTime = 0;
    }, [sounds]);

    const updateCurrency = useCallback((newCurrency: { kash: number, coins: number }) => {
        setCurrency(newCurrency);
        localStorage.setItem('themarkkade_currency', JSON.stringify(newCurrency));
        window.dispatchEvent(new Event('storage'));
    }, []);

    const calculateWinnings = useCallback((finalReels: string[]) => {
        if (!theme) return;
        let totalWin = 0;
        let freeSpinsWon = 0;

        const bonusCount = finalReels.filter(s => s === theme.bonusSymbol).length;
        if (bonusCount >= 3) {
            freeSpinsWon = theme.freeSpinsRewards[bonusCount] || 0;
        }
        
        const firstSymbol = finalReels[0];
        let matchCount = 1;
        for (let i = 1; i < REEL_COUNT; i++) {
            if (finalReels[i] === firstSymbol) {
                matchCount++;
            } else {
                break;
            }
        }

        if (matchCount >= 3) {
            const payout = theme.payouts[firstSymbol]?.[matchCount];
            if (payout) {
                totalWin = payout * BET_OPTIONS[currentBetIndex];
            }
        }
        
        if (freeSpinsWon > 0) playSound('bonus');
        else if (totalWin > 0) playSound('win');

        if (totalWin > 0 || freeSpinsWon > 0) {
            setWinAmount(totalWin);
            setFreeSpins(prev => prev + freeSpinsWon);
            // FIX: The `updateCurrency` function expects an object, not a function. Pass the updated currency object directly.
            updateCurrency({ ...currency, coins: currency.coins + totalWin });
        }
    }, [theme, currentBetIndex, updateCurrency, playSound, currency]);
    
    const handleSpin = useCallback(() => {
        if (!theme) return;
        const currentBet = BET_OPTIONS[currentBetIndex];
        if (isSpinning || (currency.coins < currentBet && freeSpins === 0)) return;

        playSound('spin');
        setWinAmount(null);
        setIsSpinning(true);

        const cost = freeSpins > 0 ? 0 : currentBet;
        if (freeSpins > 0) setFreeSpins(prev => prev - 1);

        // FIX: The `updateCurrency` function expects an object, not a function. Pass the updated currency object directly.
        updateCurrency({ ...currency, coins: currency.coins - cost });

        const finalReels = Array.from({ length: REEL_COUNT }, () => theme.symbols[Math.floor(Math.random() * theme.symbols.length)]);
        setReels(finalReels);

        setTimeout(() => {
            stopSound('spin');
            calculateWinnings(finalReels);
            setIsSpinning(false);
        }, SPIN_DURATION + 500);
    }, [isSpinning, currency, freeSpins, theme, currentBetIndex, updateCurrency, playSound, stopSound, calculateWinnings]);

    const changeBet = () => {
        setCurrentBetIndex((prevIndex) => (prevIndex + 1) % BET_OPTIONS.length);
    };

    const handleSpinClick = () => { playSound('click'); handleSpin(); };
    const handleChangeBetClick = () => { playSound('click'); changeBet(); };
    const handlePayTableClick = () => { playSound('click'); setShowPayTable(true); };

    const formatNumber = (num: number) => num.toLocaleString('en-US');
    
    if (error) {
        return (
            <div className="text-white w-screen h-screen flex flex-col items-center justify-center select-none bg-[#0a0a0a]">
                <h1 className="text-4xl font-cinzel gold-text mb-4">Error</h1>
                <p className="text-red-400 mb-8">{error}</p>
                <a href="/" className="control-button rounded-lg py-3 px-8 text-lg font-bold tracking-wider">
                    &larr; Back to Lobby
                </a>
            </div>
        );
    }

    if (!theme) {
        return <div className="text-white w-screen h-screen flex items-center justify-center">Loading Game...</div>;
    }

    const renderPayTable = () => (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPayTable(false)}>
            <div className="w-full max-w-2xl bg-[#1a1a1a] border border-yellow-600 rounded-lg p-6 text-white overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-3xl font-cinzel gold-text text-center mb-2">{theme.name}</h2>
                <p className="text-center text-sm text-gray-300 mb-6 text-justify">{theme.description}</p>
                <h3 className="text-xl font-cinzel gold-text-glow mb-4 text-center">PAY TABLE (BASE PAYOUTS)</h3>
                <div className="space-y-4">
                    {Object.entries(theme.payouts).map(([symbol, payouts]) => (
                         <div key={symbol} className="flex items-center justify-between p-2 bg-black/20 rounded">
                            <span className="text-4xl">{symbol}</span>
                            <div className="flex space-x-4 text-right">
                                <span className="w-16">3x: <span className="font-bold text-yellow-400">{(payouts as any)[3]}</span></span>
                                <span className="w-16">4x: <span className="font-bold text-yellow-400">{(payouts as any)[4]}</span></span>
                                <span className="w-16">5x: <span className="font-bold text-yellow-400">{(payouts as any)[5]}</span></span>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <span className="text-4xl">{theme.bonusSymbol}</span>
                        <div className="text-right text-yellow-400 font-bold">3, 4, or 5 symbols trigger Free Spins!</div>
                    </div>
                </div>
                <button onClick={() => setShowPayTable(false)} className="mt-6 w-full control-button py-2 rounded-lg font-bold">CLOSE</button>
            </div>
        </div>
    );

    return (
        <div className="text-white w-screen h-screen flex flex-col overflow-hidden select-none bg-[#0a0a0a]">
            {showPayTable && renderPayTable()}
            
            <div className="h-1/2 flex flex-col items-center justify-center p-4 relative">
                <a href="/" className="absolute top-4 left-4 text-yellow-400 hover:text-white transition">&larr; Back to Lobby</a>
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                    <div className="currency-display font-cinzel">
                        <span className="text-gray-400 text-lg mr-2">¢oins:</span>
                        <span className="text-xl font-bold tracking-wider">{formatNumber(currency.coins)}</span>
                    </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-cinzel gold-text tracking-wider mb-8">{theme.name}</h1>
                <div className="flex justify-center items-center gap-2 md:gap-4">
                    {reels.map((symbol, index) => (
                        <Reel key={index} finalSymbol={symbol} isSpinning={isSpinning} reelIndex={index} symbols={theme.symbols} spinDuration={SPIN_DURATION} />
                    ))}
                </div>
            </div>

            <div className="h-1/2 flex flex-col items-center justify-center p-4 bg-black/20 border-t-2 border-yellow-800/50">
                 <div className="w-full max-w-md text-center mb-4 h-12 flex items-center justify-center">
                    {winAmount !== null && winAmount > 0 && (
                        <p className="text-4xl font-cinzel font-bold win-flash">WIN: {formatNumber(winAmount)}</p>
                    )}
                    {freeSpins > 0 && !isSpinning && (
                        <p className="text-2xl font-cinzel text-yellow-400">{freeSpins} Free Spins Remaining</p>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                    <button onClick={handlePayTableClick} disabled={isSpinning} className="control-button rounded-lg py-3 text-sm md:text-base font-bold tracking-wider">PAY TABLE</button>
                    <button onClick={handleSpinClick} disabled={isSpinning || (currency.coins < BET_OPTIONS[currentBetIndex] && freeSpins === 0)} className="control-button spin-button col-span-2 rounded-lg py-4 text-xl md:text-2xl font-bold tracking-widest">
                        {freeSpins > 0 ? `SPIN (${freeSpins})` : 'SPIN'}
                    </button>
                    <div className="col-span-3 flex items-center justify-center">
                         <button onClick={handleChangeBetClick} disabled={isSpinning} className="control-button rounded-lg py-3 px-8 text-sm md:text-base font-bold tracking-wider w-full">
                            BET: {formatNumber(BET_OPTIONS[currentBetIndex])}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenericGame;