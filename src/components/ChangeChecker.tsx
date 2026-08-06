import React, { useState } from 'react';
import { CurrencyType, ScaffoldingLevel } from '../types';
import { CurrencyIcon } from './CurrencyIcon';
import { calculateOptimalChange } from '../data/currency';
import { CheckCircle2, AlertTriangle, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { speakText } from '../utils/speech';
import confetti from 'canvas-confetti';

interface ChangeCheckerProps {
  paidAmount: number;
  totalPrice: number;
  expectedChange: number;
  actualGivenChange: number;
  isWrongChangeScenario: boolean;
  scaffoldingLevel: ScaffoldingLevel;
  onVerified: (isSuccess: boolean, userSaidPhrase: boolean) => void;
}

export const ChangeChecker: React.FC<ChangeCheckerProps> = ({
  paidAmount,
  totalPrice,
  expectedChange,
  actualGivenChange,
  isWrongChangeScenario,
  scaffoldingLevel,
  onVerified,
}) => {
  const [userChoice, setUserChoice] = useState<'correct' | 'wrong' | null>(null);
  const [phraseSpoken, setPhraseSpoken] = useState(false);
  const [fixedByClerk, setFixedByClerk] = useState(false);

  // Compute breakdown of coins returned by clerk
  const currentGivenChange = fixedByClerk ? expectedChange : actualGivenChange;
  const optimalCoins = calculateOptimalChange(currentGivenChange);
  const expectedCoins = calculateOptimalChange(expectedChange);

  const isActuallyWrong = actualGivenChange !== expectedChange;

  const handleSelectCorrect = () => {
    setUserChoice('correct');
    if (!isActuallyWrong) {
      speakText('答對了！金額完全正確！說聲謝謝店員喔！');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onVerified(true, false);
    } else {
      speakText(`算算看喔！付了 ${paidAmount} 元，買了 ${totalPrice} 元，應該找 ${expectedChange} 元。店員只找了 ${actualGivenChange} 元，找錯了喔！`);
    }
  };

  const handleSelectWrong = () => {
    setUserChoice('wrong');
    speakText('發現找錯錢了！請按下口訣按鈕，勇敢跟店員說「找錯錢了！」');
  };

  const handleSpeakWrongPhrase = () => {
    setPhraseSpoken(true);
    speakText('找錯錢了！', () => {
      setFixedByClerk(true);
      speakText(`店員說：不好意思！我算錯了，補找給你 ${expectedChange - actualGivenChange} 元，總共找您 ${expectedChange} 元！`);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      onVerified(true, true);
    });
  };

  const readChangeDetails = () => {
    let text = `拿 ${paidAmount} 元，商品 ${totalPrice} 元。店員遞給你 ${currentGivenChange} 元找零。`;
    if (scaffoldingLevel === 1) {
      text += `對應錢幣包含：`;
      Object.entries(optimalCoins).forEach(([type, count]) => {
        text += `${count}個${type}元 `;
      });
    }
    speakText(text);
  };

  return (
    <div className="bg-white border-4 border-teal-300 rounded-3xl p-5 shadow-xl font-sans text-slate-800 my-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-teal-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md">
            🪙
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-teal-950 flex items-center gap-2">
              自動化找零檢查與錢幣對應
            </h3>
            <p className="text-xs text-teal-700">清點店員找給你的錢，確認金額是否正確！</p>
          </div>
        </div>

        <button
          type="button"
          onClick={readChangeDetails}
          className="flex items-center gap-1.5 bg-teal-100 hover:bg-teal-200 text-teal-900 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          <Volume2 className="w-4 h-4 text-teal-700" />
          朗讀找零錢幣
        </button>
      </div>

      {/* Visual Money Display returned by Clerk */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-200 mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold text-teal-800">店員找給你的總金額：</span>
            <div className="text-3xl font-black text-teal-900 flex items-baseline gap-1">
              <span>${currentGivenChange}</span>
              <span className="text-sm font-normal text-slate-600">元</span>
            </div>
          </div>

          {/* Level 1 Coin Breakdown */}
          {scaffoldingLevel <= 2 && (
            <div className="bg-white px-4 py-2 rounded-xl border border-teal-200 shadow-sm flex items-center gap-3">
              <span className="text-xs font-extrabold text-slate-500">視覺錢幣組合：</span>
              <div className="flex items-center gap-2">
                {Object.entries(optimalCoins).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-1">
                    <CurrencyIcon type={type as CurrencyType} size="sm" />
                    <span className="text-xs font-extrabold text-slate-800">x{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expected Calculation Hint */}
        <div className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-xl border border-teal-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            對照算式：付款 <strong>${paidAmount} 元</strong> － 花費 <strong>${totalPrice} 元</strong> ＝ 應找零 <strong>${expectedChange} 元</strong>
          </span>
        </div>
      </div>

      {/* Decision Interactive Block */}
      {!fixedByClerk ? (
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300">
          <h4 className="font-extrabold text-base text-amber-950 mb-2 flex items-center gap-2">
            <span>🤔 個案思考與確認：店員找給你的 ${currentGivenChange} 元，金額對嗎？</span>
          </h4>

          <div className="flex flex-wrap gap-3 my-3">
            <button
              type="button"
              onClick={handleSelectCorrect}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-extrabold text-sm border-2 transition-all flex items-center justify-center gap-2 shadow-sm ${
                userChoice === 'correct'
                  ? 'bg-emerald-600 text-white border-emerald-800 ring-4 ring-emerald-200'
                  : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>【✅ 找對了！】</span>
            </button>

            <button
              type="button"
              onClick={handleSelectWrong}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-extrabold text-sm border-2 transition-all flex items-center justify-center gap-2 shadow-sm ${
                userChoice === 'wrong'
                  ? 'bg-red-600 text-white border-red-800 ring-4 ring-red-200'
                  : 'bg-white hover:bg-red-50 text-red-900 border-red-300'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>【❌ 找錯錢了！】</span>
            </button>
          </div>

          {/* If user clicked 'wrong' or is wrong scenario */}
          {userChoice === 'wrong' && (
            <div className="bg-red-100 border-2 border-red-400 rounded-xl p-3.5 mt-3 text-red-950 animate-bounce">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-sm">提醒：金額算錯了，需要店員協助！</h5>
                  <p className="text-xs text-red-800">
                    因為不需要計算少給或多給多少錢，指導個案直接說標準口訣「找錯錢了！」讓店員幫忙。
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSpeakWrongPhrase}
                className="w-full mt-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black py-3 px-4 rounded-xl text-base shadow-lg transition-all flex items-center justify-center gap-2 border border-red-800"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span>🔊 大聲口訣發聲練習：「找錯錢了！」</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* After Clerk Corrects Change */
        <div className="bg-emerald-100 border-2 border-emerald-400 rounded-2xl p-4 text-emerald-950 flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
            🎉
          </div>
          <h4 className="font-black text-lg">大成功！店員已經幫你重新清點並補找齊金額！</h4>
          <p className="text-xs text-emerald-800 max-w-md">
            你非常棒！成功說出了「找錯錢了！」，店員補找了錢，現在找零金額完全正確囉！
          </p>

          <button
            type="button"
            onClick={() => onVerified(true, true)}
            className="mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
          >
            <span>完成此關卡訓練</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
