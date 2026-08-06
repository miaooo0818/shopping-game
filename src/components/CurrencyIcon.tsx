import React from 'react';
import { CurrencyType } from '../types';
import { playTone } from '../utils/speech';

interface CurrencyIconProps {
  type: CurrencyType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  count?: number;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
}

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({
  type,
  size = 'md',
  count,
  onClick,
  disabled = false,
  selected = false,
  className = '',
}) => {
  // Enhanced Size mappings for Tablet Touch targets & Visual clarity
  const sizeClasses = {
    sm: { coin: 'w-12 h-12 text-xs', bill: 'w-22 h-12 text-xs', num: 'text-base font-black' },
    md: { coin: 'w-16 h-16 text-sm', bill: 'w-30 h-16 text-sm', num: 'text-lg font-black' },
    lg: { coin: 'w-22 h-22 text-base', bill: 'w-40 h-22 text-base', num: 'text-2xl font-black' },
    xl: { coin: 'w-28 h-28 text-lg', bill: 'w-52 h-28 text-lg', num: 'text-3xl font-black' },
    '2xl': { coin: 'w-36 h-36 text-xl', bill: 'w-64 h-36 text-xl', num: 'text-4xl font-black' },
  }[size];

  const handleClick = () => {
    if (!disabled) {
      playTone('coin');
      if (onClick) onClick();
    }
  };

  if (type === '100' || type === '500') {
    // Realistic Banknotes (NT$100 & NT$500)
    const is100 = type === '100';
    return (
      <div className="relative inline-block select-none">
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`relative ${sizeClasses.bill} rounded-xl border-2 shadow-xl transition-all transform active:scale-95 flex flex-col justify-between p-2 overflow-hidden cursor-pointer ${
            is100
              ? 'bg-gradient-to-r from-red-700 via-rose-600 to-red-800 border-red-300 text-white'
              : 'bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-950 border-amber-300 text-amber-100'
          } ${selected ? 'ring-4 ring-amber-300 scale-105 shadow-2xl z-10 animate-pulse' : 'hover:brightness-110'} ${
            disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''
          } ${className}`}
          title={`${type}元鈔票 (新台幣)`}
        >
          {/* Banknote Watermark / Microprint Background Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center font-mono text-3xl font-black tracking-widest uppercase">
            {is100 ? '100 TAIWAN' : '500 TAIWAN'}
          </div>

          {/* Top Header: Central Bank & Watermark Emblem */}
          <div className="flex justify-between items-center text-[10px] md:text-xs font-black opacity-95 px-1 z-10">
            <span className="tracking-widest">中央銀行</span>
            <span className="font-mono bg-black/30 px-1 rounded text-[9px] border border-white/20">
              {is100 ? 'AL168888EX' : 'JK888888TW'}
            </span>
          </div>

          {/* Center Value Numeral with Shadow & Chinese Denomination */}
          <div className="flex items-center justify-between px-2 z-10">
            <div className="text-left leading-none">
              <span className="text-[10px] opacity-80 block font-bold">NT$</span>
              <span className={`${sizeClasses.num} drop-shadow-md font-black tracking-wider`}>
                ${type}
              </span>
            </div>
            <div className="text-right leading-tight">
              <span className="text-xs md:text-sm font-black text-amber-200 block drop-shadow-sm">
                {is100 ? '壹佰圓' : '伍佰圓'}
              </span>
              <span className="text-[9px] opacity-75 font-bold">新臺幣</span>
            </div>
          </div>

          {/* Bottom Detail Line */}
          <div className="flex justify-between items-center text-[10px] opacity-90 px-1 font-bold z-10 border-t border-white/20 pt-1">
            <span>{is100 ? '👨‍💼 孫中山先生' : '⚾ 中華少棒隊'}</span>
            <span className="font-mono text-[9px]">{type} YUAN</span>
          </div>
        </button>

        {count !== undefined && count > 1 && (
          <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-sm md:text-base px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-xl z-20">
            x{count}
          </span>
        )}
      </div>
    );
  }

  // Realistic Taiwan Coins (1, 5, 10, 50 Yuan)
  return (
    <div className="relative inline-block select-none">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`relative ${sizeClasses.coin} rounded-full transition-all transform active:scale-95 flex items-center justify-center cursor-pointer shadow-xl ${
          selected ? 'ring-4 ring-amber-400 scale-110 shadow-2xl z-10 animate-pulse' : 'hover:scale-105'
        } ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''} ${className}`}
        title={`${type}元硬幣 (新台幣)`}
      >
        {/* Coin 1 Yuan - Copper Bronze */}
        {type === '1' && (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 border-4 border-amber-500 shadow-inner flex flex-col items-center justify-center text-amber-100 p-1 relative overflow-hidden">
            <div className="absolute inset-1 rounded-full border border-amber-400/50 pointer-events-none"></div>
            <span className="text-[9px] md:text-[10px] font-black text-amber-200/90 leading-none">中華民國</span>
            <span className={`${sizeClasses.num} font-black drop-shadow-md text-amber-100 my-0.5`}>1</span>
            <span className="text-[9px] font-black text-amber-200/90 leading-none">壹圓</span>
          </div>
        )}

        {/* Coin 5 Yuan - Silver Nickel Small */}
        {type === '5' && (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 border-4 border-slate-200 shadow-inner flex flex-col items-center justify-center text-slate-950 p-1 relative overflow-hidden">
            <div className="absolute inset-1 rounded-full border border-slate-400/60 pointer-events-none"></div>
            <span className="text-[9px] md:text-[10px] font-black text-slate-700 leading-none">🌸 伍圓</span>
            <span className={`${sizeClasses.num} font-black drop-shadow-md text-slate-950 my-0.5`}>5</span>
            <span className="text-[9px] font-black text-slate-700 leading-none">中華民國</span>
          </div>
        )}

        {/* Coin 10 Yuan - Silver Nickel Medium */}
        {type === '10' && (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 border-4 border-slate-300 shadow-inner flex flex-col items-center justify-center text-white p-1 relative overflow-hidden">
            <div className="absolute inset-1.5 rounded-full border border-slate-200/70 pointer-events-none"></div>
            <span className="text-[9px] md:text-[10px] font-black text-slate-100 leading-none">拾圓</span>
            <span className={`${sizeClasses.num} font-black drop-shadow-lg text-white my-0.5`}>10</span>
            <span className="text-[9px] font-black text-slate-200 leading-none">中華民國</span>
          </div>
        )}

        {/* Coin 50 Yuan - Golden Brass Bi-Metallic Security Coin */}
        {type === '50' && (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-yellow-600 border-4 border-amber-200 shadow-inner flex items-center justify-center text-amber-950 p-1 relative overflow-hidden">
            {/* Outer Ridged Ring */}
            <div className="absolute inset-1 rounded-full border-2 border-dashed border-amber-600/60 pointer-events-none"></div>
            {/* Inner Core Circle */}
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-yellow-200 via-amber-300 to-yellow-500 border border-amber-400 flex flex-col items-center justify-center shadow-md">
              <span className="text-[9px] md:text-[10px] font-black text-amber-900 leading-none">伍拾圓</span>
              <span className={`${sizeClasses.num} font-black drop-shadow-sm text-amber-950 my-0.5`}>50</span>
              <span className="text-[8px] font-black text-amber-900 leading-none">50 / 五十</span>
            </div>
          </div>
        )}
      </button>

      {count !== undefined && count > 1 && (
        <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-sm md:text-base px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-xl z-20">
          x{count}
        </span>
      )}
    </div>
  );
};


