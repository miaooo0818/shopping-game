import React from 'react';
import { GameMode, ScaffoldingLevel } from '../types';
import { Target, ShoppingBag, Award, Volume2, VolumeX, FileText, Star, LayoutGrid, Tablet } from 'lucide-react';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  scaffoldingLevel: ScaffoldingLevel;
  onChangeScaffolding: (level: ScaffoldingLevel) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  starsCount: number;
  onOpenLayoutSelector: () => void;
  isTabletXL: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  scaffoldingLevel,
  onChangeScaffolding,
  audioEnabled,
  onToggleAudio,
  starsCount,
  onOpenLayoutSelector,
  isTabletXL,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b-4 border-emerald-500 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & App Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-1.5 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform shrink-0">
              🏪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg md:text-xl text-emerald-300 tracking-tight">
                  超商購物大冒險
                </h1>
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs shrink-0">
                  {currentMode === 'mission' ? '🎯 導引任務' : currentMode === 'free' ? '🛒 自由超市' : currentMode === 'advanced' ? '📋 多項清單' : '📊 IEP 報告'}
                </span>
                {isTabletXL && (
                  <span className="bg-teal-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs hidden sm:inline-flex items-center gap-1">
                    <Tablet className="w-3 h-3" /> 特大圖卡
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-extrabold hidden sm:block">生活購物體驗：大圖卡視覺提示與獨立付錢特訓</p>
            </div>
          </div>

          {/* Right Controls: Reselect Layout Button, Stars, Audio Toggle, Scaffolding Level */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Stars badge */}
            <div className="bg-slate-800 border border-amber-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span className="text-sm sm:text-base font-black text-amber-300">{starsCount}</span>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={onToggleAudio}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border ${
                audioEnabled
                  ? 'bg-teal-600 text-white border-teal-400 hover:bg-teal-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="語音朗讀開關"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline">{audioEnabled ? '語音 ON' : '語音 OFF'}</span>
            </button>

            {/* Scaffolding Selector */}
            <div className="bg-slate-800 border border-slate-700 p-0.5 rounded-xl hidden sm:flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onChangeScaffolding(1)}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                  scaffoldingLevel === 1
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="提示 Level 1: 完全提示"
              >
                Lv.1
              </button>
              <button
                type="button"
                onClick={() => onChangeScaffolding(2)}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                  scaffoldingLevel === 2
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="提示 Level 2: 部分提示"
              >
                Lv.2
              </button>
              <button
                type="button"
                onClick={() => onChangeScaffolding(3)}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                  scaffoldingLevel === 3
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="提示 Level 3: 獨立挑戰"
              >
                Lv.3
              </button>
            </div>

            {/* Switch Layout Modal Trigger */}
            <button
              type="button"
              onClick={onOpenLayoutSelector}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1 shadow-lg active:scale-95 border-2 border-amber-300 cursor-pointer shrink-0"
              title="點擊切換版面與選單"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>切換版面 ☰</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

