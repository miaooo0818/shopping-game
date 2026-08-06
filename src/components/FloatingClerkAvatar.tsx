import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ThumbsUp, AlertCircle, Heart, MessageCircle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { speakText, playTone } from '../utils/speech';

interface FloatingClerkAvatarProps {
  totalPaid: number;
  requiredPrice: number;
  lastActionType?: 'add' | 'remove' | 'confirm' | 'wrong_change' | 'correct_change' | 'idle';
  customFeedbackMessage?: string;
  speechRate?: number;
}

export const FloatingClerkAvatar: React.FC<FloatingClerkAvatarProps> = ({
  totalPaid,
  requiredPrice,
  lastActionType,
  customFeedbackMessage,
  speechRate = 0.85,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [clerkEmotion, setClerkEmotion] = useState<'happy' | 'encouraging' | 'cheering' | 'thinking'>('happy');
  const [message, setMessage] = useState<string>('你好！我是超商店員哥哥，準備好一起練習付錢購物了嗎？');
  const [isNewMessage, setIsNewMessage] = useState<boolean>(false);

  // Determine feedback message & emotion dynamically based on payment state
  useEffect(() => {
    if (customFeedbackMessage) {
      setMessage(customFeedbackMessage);
      setClerkEmotion('cheering');
      setIsNewMessage(true);
      return;
    }

    if (totalPaid === 0) {
      if (requiredPrice > 0) {
        setMessage(`這件商品是 ${requiredPrice} 元，請點選下方錢包裡的錢幣放到收銀台喔！`);
        setClerkEmotion('encouraging');
      } else {
        setMessage('歡迎光臨超商！選好想要買的商品後，就可以開始練習付錢囉！');
        setClerkEmotion('happy');
      }
    } else if (totalPaid < requiredPrice) {
      const diff = requiredPrice - totalPaid;
      setMessage(`加油！已經放了 ${totalPaid} 元，還差 ${diff} 元，再拿一點錢幣放上來吧！💪`);
      setClerkEmotion('thinking');
      setIsNewMessage(true);
    } else {
      // totalPaid >= requiredPrice
      setMessage(`太棒了！已放在桌上 ${totalPaid} 元，金額非常足夠！請點擊右邊【付錢給店員】！🎉`);
      setClerkEmotion('cheering');
      setIsNewMessage(true);
    }
  }, [totalPaid, requiredPrice, customFeedbackMessage, lastActionType]);

  // Flash speech bubble on message change
  useEffect(() => {
    if (isNewMessage) {
      const timer = setTimeout(() => setIsNewMessage(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isNewMessage]);

  const handleReplayVoice = () => {
    playTone('click');
    speakText(message, undefined, speechRate);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end max-w-sm w-full sm:w-auto px-2 pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end space-y-2">
        {/* Speech Bubble Area */}
        {isExpanded && (
          <div
            className={`bg-slate-900 border-4 border-amber-400 rounded-3xl p-4 shadow-2xl text-white max-w-xs md:max-w-sm transition-all transform ${
              isNewMessage ? 'scale-105 border-yellow-300 ring-4 ring-amber-400/40' : 'scale-100'
            }`}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>店員小助手 • 即時提示</span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="縮小小助手"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Body */}
            <div className="flex items-start gap-2.5">
              <p className="text-sm md:text-base font-black text-slate-100 leading-snug flex-1">
                {message}
              </p>

              <button
                type="button"
                onClick={handleReplayVoice}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-2.5 rounded-2xl shadow-md transition-transform active:scale-90 shrink-0"
                title="重新朗讀店員提示"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Progress Bar Indicator inside Bubble */}
            {requiredPrice > 0 && (
              <div className="mt-3 pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px] font-extrabold text-slate-300">
                  <span>付款進度：</span>
                  <span className={totalPaid >= requiredPrice ? 'text-emerald-400' : 'text-amber-300'}>
                    ${totalPaid} / ${requiredPrice} 元
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      totalPaid >= requiredPrice ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, (totalPaid / requiredPrice) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Avatar Button & Toggle */}
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(true);
                handleReplayVoice();
              }}
              className="bg-slate-900 border-2 border-amber-400 text-amber-300 text-xs font-black px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 hover:bg-slate-800 transition-all animate-bounce"
            >
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span>查看店員提示</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) handleReplayVoice();
            }}
            className="group relative flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            title="超商店員助手 (點擊開關提示)"
          >
            {/* Glowing Ring */}
            <div className="absolute inset-0 rounded-full bg-amber-400 blur-md opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>

            {/* Character Icon Container */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 border-4 border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden">
              <span className="text-3xl md:text-4xl transform group-hover:scale-110 transition-transform">
                {clerkEmotion === 'cheering' ? '🥳' : clerkEmotion === 'thinking' ? '🤔' : clerkEmotion === 'encouraging' ? '😃' : '🏪'}
              </span>

              <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-amber-300 text-[10px] md:text-[11px] font-black py-0.5 text-center border-t border-amber-400/50">
                店員哥哥
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
