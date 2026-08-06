import React from 'react';
import { GameMode } from '../types';
import { Target, ShoppingBag, Award, FileText, CheckCircle2, Tablet, Monitor, Volume2, X, Sparkles } from 'lucide-react';
import { playTone, speakText } from '../utils/speech';

interface LayoutSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isTabletXL: boolean;
  onToggleTabletXL: (isXL: boolean) => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
}

export const LayoutSelectorModal: React.FC<LayoutSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  isTabletXL,
  onToggleTabletXL,
  speechRate,
  onChangeSpeechRate,
}) => {
  if (!isOpen) return null;

  const handleChooseMode = (mode: GameMode) => {
    playTone('click');
    onSelectMode(mode);
    speakText(`切換到：${
      mode === 'mission' ? '導引任務訓練版面' : mode === 'free' ? '自由超市選購版面' : mode === 'advanced' ? '多項採買清單挑戰版面' : '學習報告版面'
    }`);
    onClose();
  };

  const layouts = [
    {
      id: 'mission' as GameMode,
      title: '🎯 導引任務訓練版面',
      subtitle: '適合基礎與結構化學習',
      desc: '依序解鎖情境關卡（蘋果牛奶、便當、找錯錢特訓）。包含紙筆減法卡與口訣提示。',
      badge: '特教推薦首選',
      bgGradient: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-400',
    },
    {
      id: 'free' as GameMode,
      title: '🛒 自由超市選購版面',
      subtitle: '開放式模擬超市',
      desc: '呈現超商真實貨架，學生可自由瀏覽商品、加入購物車並至櫃檯結帳。',
      badge: '真實超市模擬',
      bgGradient: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-400',
    },
    {
      id: 'advanced' as GameMode,
      title: '📋 多項採買清單挑戰版面',
      subtitle: '多品項加法與找錢特訓',
      desc: '依照採買清單選擇多樣商品，學習連加計算總價並練習找錯錢應對口訣。',
      badge: '進階綜合挑戰',
      bgGradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400',
    },
    {
      id: 'report' as GameMode,
      title: '📊 IEP 學習歷程報告版面',
      subtitle: '成效追蹤與特教記錄',
      desc: '檢視學生答對率、獨立付錢成功率與各項指標分析，可直接導出學習紀錄。',
      badge: '教師家長專用',
      bgGradient: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl max-w-4xl w-full p-6 md:p-8 text-white shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors border border-slate-700"
          title="關閉"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Title Header */}
        <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full font-black text-sm shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>重新選擇遊戲與操作版面</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-amber-300">
            請選擇您要使用的【遊戲版面】與【平板設定】
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            針對大字與簡潔視覺需求，可在此隨時切換遊戲版面與大圖卡顯示模式
          </p>
        </div>

        {/* Option 1: Display Mode / Tablet Big Card Toggle */}
        <div className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Tablet className="w-5 h-5 text-amber-400" />
              <span className="font-extrabold text-base text-amber-200">平板視覺大圖卡模式：</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTone('click');
                  onToggleTabletXL(true);
                }}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 border-2 transition-all ${
                  isTabletXL
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span>📱 平板特大圖卡 (推薦)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTone('click');
                  onToggleTabletXL(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 border-2 transition-all ${
                  !isTabletXL
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-105'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>💻 標準簡潔版面</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            💡「平板特大圖卡」將錢包剩餘個數、錢幣圖示與付錢托盤放大，讓學生在平板上點擊更加精準明確。
          </p>
        </div>

        {/* Option 2: Speech Speed Adjuster */}
        <div className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-teal-400" />
            <div>
              <span className="font-extrabold text-base text-teal-200 block">語音朗讀速度：</span>
              <span className="text-xs text-slate-400">適中的語音速度有助於清晰聆聽指令</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playTone('click');
                onChangeSpeechRate(0.75);
                speakText('這是慢速語音朗讀提示，清楚易懂。', undefined, 0.75);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                speechRate === 0.75
                  ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              🐢 慢速 (0.75x)
            </button>
            <button
              type="button"
              onClick={() => {
                playTone('click');
                onChangeSpeechRate(0.85);
                speakText('這是標準特教語音朗讀提示。', undefined, 0.85);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                speechRate === 0.85
                  ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              🐰 適中 (0.85x)
            </button>
          </div>
        </div>

        {/* Game Mode Selection Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">選擇訓練遊戲版面</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {layouts.map((layout) => {
              const isSelected = currentMode === layout.id;

              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => handleChooseMode(layout.id)}
                  className={`text-left p-5 rounded-2xl border-3 transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? `bg-slate-800 border-amber-400 ring-4 ring-amber-400/30 scale-[1.02] shadow-2xl`
                      : `bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800`
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-300 border border-slate-700">
                      {layout.badge}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-emerald-400 font-black text-xs bg-emerald-950/90 px-2.5 py-1 rounded-full border border-emerald-500">
                        <CheckCircle2 className="w-4 h-4" /> 當前使用中
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {layout.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mb-2">{layout.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{layout.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Confirm Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-3 rounded-2xl text-base shadow-xl transition-all active:scale-95"
          >
            確定並返回訓練畫面
          </button>
        </div>
      </div>
    </div>
  );
};
