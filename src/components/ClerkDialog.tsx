import React from 'react';
import { Volume2, MessageSquare, AlertTriangle, CheckCircle2, HeartHandshake } from 'lucide-react';
import { speakText } from '../utils/speech';

interface ClerkDialogProps {
  clerkText: string;
  isWrongChangeScenario?: boolean;
  actualGivenChange?: number;
  expectedChange?: number;
  onSelectPhrase?: (phrase: string) => void;
  selectedPhrase?: string;
  className?: string;
}

export const ClerkDialog: React.FC<ClerkDialogProps> = ({
  clerkText,
  isWrongChangeScenario = false,
  actualGivenChange,
  expectedChange,
  onSelectPhrase,
  selectedPhrase,
  className = '',
}) => {
  const handleSpeakClerk = () => {
    speakText(clerkText);
  };

  const handlePhraseClick = (phrase: string) => {
    speakText(phrase);
    if (onSelectPhrase) {
      onSelectPhrase(phrase);
    }
  };

  return (
    <div className={`bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md ${className}`}>
      <div className="flex items-start gap-4">
        {/* Convenience Store Clerk Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 shadow-md flex items-center justify-center relative">
            <span className="text-3xl md:text-4xl">🏪</span>
            <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-800">
              全家/7-11店員
            </span>
          </div>
          <span className="text-xs font-extrabold text-slate-700 mt-1">店員哥哥/姊姊</span>
        </div>

        {/* Dialogue Bubble */}
        <div className="flex-1">
          <div className="relative bg-slate-100 border-2 border-slate-300 rounded-2xl p-3.5 shadow-inner">
            {/* Speech Bubble Arrow */}
            <div className="absolute top-4 -left-2.5 w-4 h-4 bg-slate-100 border-l-2 border-b-2 border-slate-300 transform rotate-45"></div>

            <div className="flex items-start justify-between gap-2">
              <p className="text-slate-900 font-extrabold text-sm md:text-base leading-snug">
                {clerkText}
              </p>
              <button
                type="button"
                onClick={handleSpeakClerk}
                className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl transition-all shadow-sm shrink-0 active:scale-90"
                title="播放店員語音"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Social Practice Buttons */}
          <div className="mt-3">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>你的社交練習對話（點擊按鈕或大聲唸出來）：</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Primary Target Protocol Phrase: 找錯錢了！ */}
              <button
                type="button"
                onClick={() => handlePhraseClick('找錯錢了！')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all border-2 shadow-sm ${
                  isWrongChangeScenario
                    ? 'bg-red-500 hover:bg-red-600 text-white border-red-700 animate-pulse ring-4 ring-red-200 shadow-red-200'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                } ${selectedPhrase === '找錯錢了！' ? 'ring-4 ring-yellow-400 scale-105' : ''}`}
              >
                <AlertTriangle className="w-4 h-4 text-red-100 shrink-0" />
                <span>「找錯錢了！」(重要應對口訣)</span>
              </button>

              {/* Correct Change Phrase */}
              <button
                type="button"
                onClick={() => handlePhraseClick('金額正確，謝謝店員！')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all border-2 shadow-sm ${
                  selectedPhrase === '金額正確，謝謝店員！'
                    ? 'bg-emerald-600 text-white border-emerald-800 ring-4 ring-yellow-400 scale-105'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>「金額正確，謝謝店員！」</span>
              </button>

              {/* Ask for help calculating change */}
              <button
                type="button"
                onClick={() => handlePhraseClick('請幫我看找零金額')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedPhrase === '請幫我看找零金額'
                    ? 'bg-blue-600 text-white border-blue-800'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>「請幫我看找零金額」</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
