import React from 'react';
import { CurrencyType, ScaffoldingLevel } from '../types';
import { CurrencyIcon } from './CurrencyIcon';
import { CURRENCIES } from '../data/currency';
import { Wallet, Sparkles, RotateCcw } from 'lucide-react';

interface WalletTrayProps {
  walletCounts: { [key in CurrencyType]: number };
  onAddMoney: (type: CurrencyType) => void;
  onResetWallet?: () => void;
  scaffoldingLevel: ScaffoldingLevel;
  recommendedType?: CurrencyType;
  disabled?: boolean;
  isTabletXL?: boolean;
}

export const WalletTray: React.FC<WalletTrayProps> = ({
  walletCounts,
  onAddMoney,
  onResetWallet,
  scaffoldingLevel,
  recommendedType,
  disabled = false,
  isTabletXL = true,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border-3 border-amber-500/40 rounded-3xl p-4 md:p-6 text-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-700/80 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-slate-950 p-2.5 rounded-2xl font-black shadow-lg text-xl">
            <Wallet className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h3 className="font-black text-lg md:text-2xl text-amber-300 flex items-center gap-2">
              👛 我的錢包 (點擊鈔票/硬幣放上收銀台)
            </h3>
            <p className="text-xs md:text-sm text-slate-300 font-bold">點選需要的面額，下方會清楚顯示剩餘個數</p>
          </div>
        </div>

        {onResetWallet && (
          <button
            type="button"
            onClick={onResetWallet}
            className="flex items-center gap-1.5 text-xs md:text-sm text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-2 border-amber-500/50 px-3.5 py-2 rounded-xl transition-all shadow-md font-black cursor-pointer active:scale-95"
            title="隨機變換錢包內的硬幣與鈔票數量以提升作答挑戰"
          >
            <RotateCcw className="w-4 h-4" />
            <span>🔄 更新錢包配置</span>
          </button>
        )}
      </div>

      {/* Level 1 Hint Badge */}
      {scaffoldingLevel === 1 && recommendedType && (
        <div className="bg-amber-400 text-slate-950 border-2 border-amber-200 rounded-2xl p-3 mb-4 flex items-center gap-3 text-sm md:text-base font-black shadow-lg animate-bounce">
          <Sparkles className="w-6 h-6 text-slate-900 shrink-0" />
          <span>【提示】拿 1 個 {recommendedType} 元 {recommendedType === '100' || recommendedType === '500' ? '鈔票' : '硬幣'} 付給店員！</span>
        </div>
      )}

      {/* Currency Grid with Tablet-Optimized Large Touch Targets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 items-center justify-items-center bg-slate-950/80 p-4 md:p-5 rounded-2xl border-2 border-slate-800">
        {CURRENCIES.map((curr) => {
          const count = walletCounts[curr.type] || 0;
          const isRecommended = scaffoldingLevel === 1 && recommendedType === curr.type;

          return (
            <div key={curr.type} className="flex flex-col items-center gap-2 w-full p-2 rounded-xl hover:bg-slate-900/60 transition-colors">
              <CurrencyIcon
                type={curr.type}
                size={isTabletXL ? 'lg' : 'md'}
                disabled={disabled || count <= 0}
                selected={isRecommended}
                onClick={() => onAddMoney(curr.type)}
                className={isRecommended ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-slate-950' : ''}
              />

              {/* GIANT HIGH-CONTRAST REMAINING COUNT BADGE */}
              <div
                className={`mt-1 px-3 py-1.5 rounded-full font-black text-xs md:text-sm border-2 shadow-md flex items-center gap-1 transition-all ${
                  count > 0
                    ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700 opacity-60'
                }`}
              >
                <span>剩餘</span>
                <span className="text-base md:text-lg font-black">{count}</span>
                <span>個</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

