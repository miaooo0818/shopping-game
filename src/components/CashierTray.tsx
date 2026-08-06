import React from 'react';
import { CurrencyType } from '../types';
import { CurrencyIcon } from './CurrencyIcon';
import { CreditCard, ArrowRight, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { speakText, playTone } from '../utils/speech';
import { FloatingClerkAvatar } from './FloatingClerkAvatar';

interface CashierTrayProps {
  paidItems: { type: CurrencyType; id: string }[];
  totalPaid: number;
  requiredPrice: number;
  onRemoveItem: (id: string) => void;
  onClearTray: () => void;
  onConfirmPayment: () => void;
  disabled?: boolean;
}

export const CashierTray: React.FC<CashierTrayProps> = ({
  paidItems,
  totalPaid,
  requiredPrice,
  onRemoveItem,
  onClearTray,
  onConfirmPayment,
  disabled = false,
}) => {
  const isEnough = totalPaid >= requiredPrice;
  const hasOverlargeBill = requiredPrice <= 100 && paidItems.some(i => i.type === '500');

  const handleConfirm = () => {
    if (!isEnough) {
      playTone('error');
      speakText(`還差 ${requiredPrice - totalPaid} 元，錢還不夠喔，請點選錢包再放一點錢！`);
      return;
    }

    if (hasOverlargeBill) {
      playTone('error');
      speakText(`面額太大了喔！買 ${requiredPrice} 元的商品不需要拿 500 元大鈔，嘗試點擊 500 元鈔票放回錢包，改用 100 元或硬幣付錢喔！`);
      return;
    }

    playTone('success');
    speakText(`拿 ${totalPaid} 元給店員付錢！`);
    onConfirmPayment();
  };

  return (
    <div className="bg-amber-100/95 border-4 border-amber-400 rounded-3xl p-5 md:p-6 shadow-2xl text-slate-900 relative">
      {/* Wood texture counter bar header */}
      <div className="flex items-center justify-between pb-3.5 border-b-3 border-amber-300 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 text-white p-2.5 rounded-2xl font-black shadow-md text-xl">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h3 className="font-black text-lg md:text-2xl text-amber-950 flex items-center gap-2">
              💳 收銀台托盤 (擺要給店員的錢)
            </h3>
            <p className="text-xs md:text-sm text-amber-900 font-extrabold">點擊托盤上的錢幣可放回錢包重新選擇</p>
          </div>
        </div>

        {paidItems.length > 0 && (
          <button
            type="button"
            onClick={() => {
              playTone('remove');
              onClearTray();
            }}
            className="flex items-center gap-1.5 text-xs md:text-sm text-red-800 bg-red-100 hover:bg-red-200 border-2 border-red-300 px-3 py-2 rounded-xl font-black transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>清空重放</span>
          </button>
        )}
      </div>

      {/* Tray Inner Area - Enlarged for Tablet Touch */}
      <div className="min-h-[160px] md:min-h-[220px] bg-white border-3 border-dashed border-amber-500 rounded-2xl p-4 md:p-6 flex flex-wrap items-center justify-center gap-4 shadow-inner relative">
        {paidItems.length === 0 ? (
          <div className="text-amber-900/60 font-black text-base md:text-xl text-center py-8 space-y-2">
            <div className="text-4xl animate-bounce">👇</div>
            <div>請點選下方「錢包」裡的硬幣或鈔票，放上收銀台！</div>
          </div>
        ) : (
          paidItems.map((item) => (
            <div key={item.id} className="animate-fade-in transform hover:scale-105 transition-transform">
              <CurrencyIcon
                type={item.type}
                size="lg"
                onClick={() => {
                  playTone('remove');
                  onRemoveItem(item.id);
                }}
                className="border-amber-400 shadow-xl cursor-pointer hover:brightness-110"
              />
            </div>
          ))
        )}
      </div>

      {/* Summary Footer Bar - Giant Numbers & Prominent Tablet Button */}
      <div className="mt-5 pt-4 border-t-3 border-amber-300 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="bg-white px-5 py-3 rounded-2xl border-3 border-amber-300 shadow-md flex items-center gap-2">
            <span className="text-xs md:text-sm font-black text-slate-500">已放桌上：</span>
            <span className="text-2xl md:text-3xl font-black text-amber-900">${totalPaid} 元</span>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border-3 border-blue-300 shadow-md flex items-center gap-2">
            <span className="text-xs md:text-sm font-black text-slate-500">商品金額：</span>
            <span className="text-2xl md:text-3xl font-black text-blue-700">${requiredPrice} 元</span>
          </div>
        </div>

        {/* Status indicator and Giant Submit payment button */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {totalPaid > 0 && (
            <div className="text-sm md:text-base font-black">
              {hasOverlargeBill ? (
                <span className="text-amber-950 flex items-center gap-1.5 bg-amber-300 px-4 py-2.5 rounded-2xl border-2 border-amber-500 shadow-sm animate-pulse">
                  <AlertCircle className="w-5 h-5 text-amber-900" /> 面額過大（不需用 500 元）
                </span>
              ) : isEnough ? (
                <span className="text-emerald-800 flex items-center gap-1.5 bg-emerald-100 px-4 py-2.5 rounded-2xl border-2 border-emerald-400 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> 金額已足夠！
                </span>
              ) : (
                <span className="text-red-800 flex items-center gap-1.5 bg-red-100 px-4 py-2.5 rounded-2xl border-2 border-red-400 shadow-sm animate-pulse">
                  <AlertCircle className="w-5 h-5 text-red-600" /> 還差 ${requiredPrice - totalPaid} 元
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={disabled || !isEnough}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg md:text-xl font-black text-white shadow-xl transition-all active:scale-95 border-2 min-h-[60px] ${
              isEnough && !disabled
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 border-emerald-300 cursor-pointer animate-bounce shadow-emerald-600/30'
                : 'bg-slate-400 border-slate-300 cursor-not-allowed opacity-60'
            }`}
          >
            <span>付錢給店員</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Floating Supermarket Clerk Avatar Assistant */}
      <FloatingClerkAvatar totalPaid={totalPaid} requiredPrice={requiredPrice} />
    </div>
  );
};

