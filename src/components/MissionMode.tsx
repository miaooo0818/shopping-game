import React, { useState, useEffect } from 'react';
import { CurrencyType, Mission, ScaffoldingLevel, StepRecord } from '../types';
import { MISSIONS } from '../data/missions';
import { PRODUCTS } from '../data/items';
import { getRecommendedPayment, generateVariedWalletForPrice } from '../data/currency';
import { WalletTray } from './WalletTray';
import { CashierTray } from './CashierTray';
import { ClerkDialog } from './ClerkDialog';
import { PaperMathHelper } from './PaperMathHelper';
import { ChangeChecker } from './ChangeChecker';
import { speakText } from '../utils/speech';
import { Target, CheckCircle2, ChevronRight, RefreshCcw, Sparkles, AlertTriangle, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionModeProps {
  scaffoldingLevel: ScaffoldingLevel;
  onRecordStep: (record: StepRecord) => void;
  onEarnStar: () => void;
}

export const MissionMode: React.FC<MissionModeProps> = ({
  scaffoldingLevel,
  onRecordStep,
  onEarnStar,
}) => {
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [step, setStep] = useState<'intro' | 'paying' | 'checking_change' | 'completed'>('intro');

  // Money in tray
  const [paidItems, setPaidItems] = useState<{ type: CurrencyType; id: string }[]>([]);

  // Student's initial wallet state
  const [walletCounts, setWalletCounts] = useState<{ [key in CurrencyType]: number }>({
    '1': 10,
    '5': 5,
    '10': 10,
    '50': 4,
    '100': 3,
    '500': 1,
  });

  const [selectedPhrase, setSelectedPhrase] = useState<string>('');

  const mission: Mission = MISSIONS[currentMissionIndex];

  // Calculate items in target mission
  const targetProducts = mission.targetItems.map(item => {
    const p = PRODUCTS.find(prod => prod.id === item.productId)!;
    return { product: p, quantity: item.quantity };
  });

  const totalPrice = targetProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const totalPaid = paidItems.reduce((sum, item) => sum + parseInt(item.type, 10), 0);
  const expectedChange = totalPaid - totalPrice;

  const actualGivenChange = mission.isWrongChangeScenario && mission.wrongChangeAmount !== undefined
    ? mission.wrongChangeAmount
    : expectedChange;

  // Level 1 recommendation hint
  const recommendation = getRecommendedPayment(totalPrice);

  useEffect(() => {
    // Reset state & generate price-tailored varied wallet when mission changes
    setStep('intro');
    setPaidItems([]);
    setSelectedPhrase('');
    setWalletCounts(generateVariedWalletForPrice(totalPrice));
  }, [currentMissionIndex, totalPrice]);

  const handleStartMission = () => {
    setStep('paying');
    setWalletCounts(generateVariedWalletForPrice(totalPrice));
    speakText(`關卡開始：${mission.title}。商品總共 ${totalPrice} 元。請從錢包拿錢付給店員。`);
  };

  const handleAddMoney = (type: CurrencyType) => {
    if (walletCounts[type] <= 0) return;

    setWalletCounts(prev => ({ ...prev, [type]: prev[type] - 1 }));
    setPaidItems(prev => [...prev, { type, id: `${type}_${Date.now()}_${Math.random()}` }]);
    speakText(`拿出 ${type} 元`);
  };

  const handleRemoveMoney = (id: string) => {
    const itemToRemove = paidItems.find(item => item.id === id);
    if (!itemToRemove) return;

    setPaidItems(prev => prev.filter(item => item.id !== id));
    setWalletCounts(prev => ({
      ...prev,
      [itemToRemove.type]: (prev[itemToRemove.type] || 0) + 1,
    }));
  };

  const handleClearTray = () => {
    // Return all items to wallet
    const newWallet = { ...walletCounts };
    paidItems.forEach(item => {
      newWallet[item.type] = (newWallet[item.type] || 0) + 1;
    });
    setWalletCounts(newWallet);
    setPaidItems([]);
  };

  const handleConfirmPayment = () => {
    if (totalPaid < totalPrice) return;

    setStep('checking_change');
    let text = `收到 ${totalPaid} 元！`;
    if (mission.isWrongChangeScenario) {
      text += `店員遞給你找零 ${actualGivenChange} 元。仔細看看金額對不對喔！`;
    } else {
      text += `店員遞給你找零 ${expectedChange} 元。請點數找零！`;
    }
    speakText(text);
  };

  const handleVerifiedChange = (isSuccess: boolean, userSaidPhrase: boolean) => {
    setStep('completed');
    onEarnStar();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Save step record for Special Education report
    onRecordStep({
      id: `${Date.now()}`,
      timestamp: new Date(),
      mode: 'mission',
      missionTitle: mission.title,
      totalPrice,
      paidAmount: totalPaid,
      expectedChange,
      actualGivenChange,
      isWrongChangeScenario: mission.isWrongChangeScenario || false,
      userDetectedWrongChangeCorrectly: isSuccess,
      userSaidPhraseCorrectly: userSaidPhrase || selectedPhrase === '找錯錢了！',
      paymentCorrect: true,
      scaffoldingUsed: scaffoldingLevel,
      score: 100,
    });
  };

  const handleNextMission = () => {
    if (currentMissionIndex < MISSIONS.length - 1) {
      setCurrentMissionIndex(prev => prev + 1);
    } else {
      setCurrentMissionIndex(0); // Loop back or congratulate
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-5">
      {/* Mission Selection Carousel / Tabs */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="font-black text-base md:text-lg text-slate-900">
              選擇特訓關卡 (共 {MISSIONS.length} 關)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            當前進度：關卡 {currentMissionIndex + 1} / {MISSIONS.length}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {MISSIONS.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setCurrentMissionIndex(idx)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border-2 flex items-center gap-2 ${
                currentMissionIndex === idx
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-base">{m.icon}</span>
              <div className="text-left">
                <div className="line-clamp-1">{m.title}</div>
                <div className="text-[10px] opacity-80 font-normal">{m.difficulty}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Mission Workspace */}
      <div className="bg-gradient-to-br from-slate-50 to-amber-50/30 border-2 border-emerald-200 rounded-3xl p-5 md:p-6 shadow-xl space-y-6">
        {/* Mission Info Banner */}
        <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-emerald-300 shadow-xs">
              {mission.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900">{mission.title}</h3>
                {mission.isWrongChangeScenario && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md animate-pulse">
                    ⚠️ 找錯錢應對特訓
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-bold mt-0.5">{mission.subtitle}</p>
              <p className="text-xs text-slate-500 mt-1">{mission.description}</p>
            </div>
          </div>

          <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200 flex items-center gap-4 shrink-0">
            <div>
              <span className="text-xs text-slate-500 font-bold block">目標購買商品：</span>
              <div className="flex items-center gap-2 mt-1">
                {targetProducts.map(tp => (
                  <div key={tp.product.id} className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <span>{tp.product.image}</span>
                    <span>{tp.product.name}</span>
                    <span className="text-emerald-700 font-black">${tp.product.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right border-l border-emerald-200 pl-4">
              <span className="text-xs text-slate-500 font-bold">應付總額</span>
              <div className="text-2xl font-black text-amber-600">${totalPrice} 元</div>
            </div>
          </div>
        </div>

        {/* Clerk Interactive Dialogue */}
        <ClerkDialog
          clerkText={
            step === 'intro'
              ? `歡迎光臨！請幫我拿金額放上收銀台，總共是 ${totalPrice} 元！`
              : step === 'paying'
              ? `好的！收到您的錢囉，請確認金額是否足夠。`
              : step === 'checking_change'
              ? `收您 ${totalPaid} 元，遞給您找零 ${actualGivenChange} 元，謝謝您！`
              : `謝謝光臨，歡迎下次再來！`
          }
          isWrongChangeScenario={mission.isWrongChangeScenario && step === 'checking_change'}
          actualGivenChange={actualGivenChange}
          expectedChange={expectedChange}
          onSelectPhrase={(phrase) => setSelectedPhrase(phrase)}
          selectedPhrase={selectedPhrase}
        />

        {/* STEP 1: INTRO -> Start Paying */}
        {step === 'intro' && (
          <div className="text-center py-6 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm p-6">
            <h4 className="font-extrabold text-lg text-slate-900 mb-2">準備好開始挑戰這個關卡了嗎？</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
              提示：買 <strong>${totalPrice} 元</strong> 的商品。你可以從錢包拿鈔票或硬幣擺到收銀台上！
            </p>
            <button
              type="button"
              onClick={handleStartMission}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-2xl text-base transition-all shadow-lg active:scale-95 inline-flex items-center gap-2"
            >
              <span>開始拿出錢包付錢</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: PAYING -> Cashier Tray & Wallet */}
        {(step === 'paying' || step === 'checking_change') && (
          <div className="space-y-6">
            <CashierTray
              paidItems={paidItems}
              totalPaid={totalPaid}
              requiredPrice={totalPrice}
              onRemoveItem={handleRemoveMoney}
              onClearTray={handleClearTray}
              onConfirmPayment={handleConfirmPayment}
              disabled={step === 'checking_change'}
            />

            {step === 'paying' && (
              <WalletTray
                walletCounts={walletCounts}
                onAddMoney={handleAddMoney}
                onResetWallet={() =>
                  setWalletCounts(generateVariedWalletForPrice(totalPrice))
                }
                scaffoldingLevel={scaffoldingLevel}
                recommendedType={recommendation.coins[0]?.type}
              />
            )}
          </div>
        )}

        {/* STEP 3: CHECKING CHANGE -> Visual Math Paper Helper & Change Checker */}
        {step === 'checking_change' && (
          <div className="space-y-4">
            {/* Paper Subtraction Helper Card */}
            {scaffoldingLevel <= 2 && (
              <PaperMathHelper
                paidAmount={totalPaid}
                priceAmount={totalPrice}
                expectedChange={expectedChange}
              />
            )}

            {/* Change Checker & Wrong Change practice */}
            <ChangeChecker
              paidAmount={totalPaid}
              totalPrice={totalPrice}
              expectedChange={expectedChange}
              actualGivenChange={actualGivenChange}
              isWrongChangeScenario={mission.isWrongChangeScenario || false}
              scaffoldingLevel={scaffoldingLevel}
              onVerified={handleVerifiedChange}
            />
          </div>
        )}

        {/* STEP 4: COMPLETED -> Celebration & Next Level */}
        {step === 'completed' && (
          <div className="bg-white border-4 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-20 h-20 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-4xl mx-auto font-black shadow-lg">
              🌟
            </div>
            <h3 className="font-black text-2xl text-slate-900">恭喜順利完成【{mission.title}】！</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto font-bold">
              你獲得了 1 顆獎勵星星！成功掌握付錢與找零確認技能！
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('intro')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1.5"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>重新練習本關</span>
              </button>

              <button
                type="button"
                onClick={handleNextMission}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black px-7 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>進行下一個關卡</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
