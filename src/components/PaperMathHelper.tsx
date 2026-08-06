import React, { useState } from 'react';
import { HelpCircle, CheckCircle, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { speakText } from '../utils/speech';

interface PaperMathHelperProps {
  paidAmount: number;
  priceAmount: number;
  expectedChange: number;
  onCompleted?: () => void;
}

export const PaperMathHelper: React.FC<PaperMathHelperProps> = ({
  paidAmount,
  priceAmount,
  expectedChange,
  onCompleted,
}) => {
  const [showBorrowingDetails, setShowBorrowingDetails] = useState(true);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Decompose numbers into hundreds, tens, ones
  const paidTens = Math.floor((paidAmount % 100) / 10);
  const paidOnes = paidAmount % 10;
  const paidHundreds = Math.floor(paidAmount / 100);

  const priceTens = Math.floor((priceAmount % 100) / 10);
  const priceOnes = priceAmount % 10;
  const priceHundreds = Math.floor(priceAmount / 100);

  // Borrowing logic calculation
  const needsBorrowOnes = paidOnes < priceOnes;
  const borrowedOnes = needsBorrowOnes ? paidOnes + 10 : paidOnes;
  const borrowedTens = needsBorrowOnes ? paidTens - 1 : paidTens;

  const handleCheckAnswer = () => {
    const num = parseInt(userAnswer.trim(), 10);
    if (num === expectedChange) {
      setIsCorrect(true);
      speakText(`答對了！ ${paidAmount} 減去 ${priceAmount} 等於 ${expectedChange} 元！`);
      if (onCompleted) onCompleted();
    } else {
      setIsCorrect(false);
      speakText(`再算算看喔！答案不是 ${userAnswer} 元。可以用旁邊的紙筆算式輔助喔！`);
    }
  };

  const speakMathSteps = () => {
    let text = `紙筆減法計算：付給店員 ${paidAmount} 元，買東西花了 ${priceAmount} 元。`;
    if (needsBorrowOnes) {
      text += `個位數 0 減 5 不夠減，向十位數借 1。個位數變成 10 減 5 等於 5。十位數變成 4 減 3 等於 1。所以找零是 ${expectedChange} 元。`;
    } else {
      text += `個位數 ${paidOnes} 減 ${priceOnes} 等於 ${paidOnes - priceOnes}。十位數 ${paidTens} 減 ${priceTens} 等於 ${paidTens - priceTens}。找零是 ${expectedChange} 元。`;
    }
    speakText(text);
  };

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 md:p-5 shadow-sm my-3 font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-200 mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 text-white p-2 rounded-xl shadow-sm">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base md:text-lg text-amber-900 flex items-center gap-1.5">
              直式減法紙筆輔助卡 (計算找零)
            </h4>
            <p className="text-xs text-amber-700">用這張輔助卡，模擬紙筆計算：付出的錢 － 商品金額</p>
          </div>
        </div>
        <button
          type="button"
          onClick={speakMathSteps}
          className="flex items-center gap-1 bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
        >
          <Volume2 className="w-4 h-4 text-amber-800" />
          朗讀計算步驟
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Side: Simulated Notebook Paper Vertical Subtraction */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-inner relative overflow-hidden font-mono">
          {/* Notebook Grid Paper Effect */}
          <div className="absolute top-0 bottom-0 left-8 border-r border-red-200 pointer-events-none"></div>

          <div className="pl-6 flex flex-col items-end text-2xl font-black text-slate-800 space-y-1 tracking-widest">
            {/* Borrowing Indicators (Red annotations) */}
            {showBorrowingDetails && needsBorrowOnes && (
              <div className="flex gap-4 text-xs font-extrabold text-red-600 mb-1 pr-1">
                <span className="line-through text-slate-400 mr-2">{paidTens}</span>
                <span className="bg-red-100 px-1 rounded border border-red-300">
                  [{borrowedTens}]
                </span>
                <span className="bg-red-100 px-1 rounded border border-red-300">
                  [{borrowedOnes}]
                </span>
              </div>
            )}

            {/* Minuend: Paid Amount */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 font-sans tracking-normal">付出的錢</span>
              <span className="text-blue-700">{paidAmount}</span>
            </div>

            {/* Subtrahend: Price */}
            <div className="flex items-center gap-4 border-b-4 border-slate-800 pb-1 w-full justify-end">
              <span className="text-xl text-red-600 font-bold mr-auto">－</span>
              <span className="text-xs text-slate-500 font-sans tracking-normal">商品花費</span>
              <span className="text-amber-700">{priceAmount}</span>
            </div>

            {/* Difference: Expected Change */}
            <div className="flex items-center gap-4 pt-1 text-emerald-700">
              <span className="text-xs text-emerald-800 font-sans tracking-normal font-bold">
                應找零金額
              </span>
              <span>{expectedChange} 元</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 font-sans flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowBorrowingDetails(!showBorrowingDetails)}
              className="text-amber-700 underline font-bold hover:text-amber-900"
            >
              {showBorrowingDetails ? '隱藏借位提示' : '顯示借位提示 (個位數不夠減向十位數借 1)'}
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Student Practice Input & Visual Coin Match */}
        <div className="bg-amber-100/70 rounded-xl p-4 border border-amber-200 flex flex-col justify-between h-full">
          <div>
            <h5 className="font-bold text-sm text-amber-900 mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              動手算一算：付 ${paidAmount} 元 － 買 ${priceAmount} 元
            </h5>
            <p className="text-xs text-slate-700 mb-3">
              請看左邊直式算式，在下面輸入你算出來的找零金額：
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setIsCorrect(null);
                }}
                placeholder="輸入找零金額"
                className="w-32 px-3 py-2 text-lg font-black border-2 border-amber-400 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
              />
              <span className="font-bold text-amber-900">元</span>

              <button
                type="button"
                onClick={handleCheckAnswer}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                檢查答案
              </button>
            </div>

            {isCorrect === true && (
              <div className="bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-xl p-2.5 text-xs font-bold flex items-center gap-2 animate-bounce">
                🎉 太棒了！答對了！店員應該找您 {expectedChange} 元！
              </div>
            )}
            {isCorrect === false && (
              <div className="bg-red-100 border border-red-400 text-red-900 rounded-xl p-2.5 text-xs font-bold flex items-center gap-2">
                ❌ 沒關係，再看看左邊的直式算式，重新算算看喔！
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs text-amber-800">
            💡 <strong>找零教學口訣：</strong>「先算個位數，不夠向十位數借 10；算完記得點數找回來的硬幣喔！」
          </div>
        </div>
      </div>
    </div>
  );
};
