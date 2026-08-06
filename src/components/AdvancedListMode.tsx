import React, { useState } from 'react';
import { CurrencyType, Product, ScaffoldingLevel, StepRecord } from '../types';
import { PRODUCTS } from '../data/items';
import { WalletTray } from './WalletTray';
import { CashierTray } from './CashierTray';
import { ClerkDialog } from './ClerkDialog';
import { PaperMathHelper } from './PaperMathHelper';
import { ChangeChecker } from './ChangeChecker';
import { CustomScenarioModal, CustomChallenge } from './CustomScenarioModal';
import { getRecommendedPayment, generateVariedWalletForPrice } from '../data/currency';
import { speakText, playTone } from '../utils/speech';
import { Award, CheckSquare, Square, ArrowRight, PlusCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdvancedChallenge {
  id: string;
  title: string;
  subtitle: string;
  budget: number;
  itemsNeeded: { productId: string; targetQuantity: number }[];
  isCustom?: boolean;
}

const DEFAULT_CHALLENGES: AdvancedChallenge[] = [
  {
    id: 'c1',
    title: '任務一：【早餐店活力採買】',
    subtitle: '準備元氣早餐！購買香氣茶葉蛋 1 個 + 全脂鮮乳 1 瓶',
    budget: 100,
    itemsNeeded: [
      { productId: 'tea_egg', targetQuantity: 1 },
      { productId: 'fresh_milk', targetQuantity: 1 }
    ],
  },
  {
    id: 'c2',
    title: '任務二：【文具店備齊學習用品】',
    subtitle: '上課用品補給！購買 2B木質鉛筆 1 枝 + 潔淨橡皮擦 1 個 + 作業簿 1 本',
    budget: 100,
    itemsNeeded: [
      { productId: 'pencil_2b', targetQuantity: 1 },
      { productId: 'eraser', targetQuantity: 1 },
      { productId: 'notebook', targetQuantity: 1 }
    ],
  },
  {
    id: 'c3',
    title: '任務三：【下課點心零食分享】',
    subtitle: '下課歡樂時光！購買國農蘋果牛奶 1 瓶 + 巧克力夾心餅乾 1 包 + 水果QQ糖 1 包',
    budget: 100,
    itemsNeeded: [
      { productId: 'apple_milk', targetQuantity: 1 },
      { productId: 'chocolate_biscuit', targetQuantity: 1 },
      { productId: 'gummy_candy', targetQuantity: 1 }
    ],
  },
  {
    id: 'c4',
    title: '任務四：【超商豐盛正餐午餐】',
    subtitle: '買午餐時間到囉！購買香酥雞腿便當 1 個 + 鮪魚御飯糰 1 個 + 百分百柳橙汁 1 瓶',
    budget: 200,
    itemsNeeded: [
      { productId: 'bento_chicken', targetQuantity: 1 },
      { productId: 'tuna_onigiri', targetQuantity: 1 },
      { productId: 'orange_juice', targetQuantity: 1 }
    ],
  },
  {
    id: 'c5',
    title: '任務五：【家庭衛生用品幫忙買】',
    subtitle: '幫媽媽跑腿買用品！購買隨身袖珍包面紙 2 包 + 純水濕紙巾 1 包',
    budget: 100,
    itemsNeeded: [
      { productId: 'tissue_paper', targetQuantity: 2 },
      { productId: 'wet_wipes', targetQuantity: 1 }
    ],
  },
  {
    id: 'c6',
    title: '任務六：【幫阿嬤買下午茶】',
    subtitle: '貼心小幫手！購買原味洋芋片 1 包 + 全脂鮮乳 1 瓶 + 巧克力夾心餅乾 1 包',
    budget: 200,
    itemsNeeded: [
      { productId: 'potato_chips', targetQuantity: 1 },
      { productId: 'fresh_milk', targetQuantity: 1 },
      { productId: 'chocolate_biscuit', targetQuantity: 1 }
    ],
  }
];

interface AdvancedListModeProps {
  scaffoldingLevel: ScaffoldingLevel;
  onRecordStep: (record: StepRecord) => void;
  onEarnStar: () => void;
}

export const AdvancedListMode: React.FC<AdvancedListModeProps> = ({
  scaffoldingLevel,
  onRecordStep,
  onEarnStar,
}) => {
  const [challenges, setChallenges] = useState<AdvancedChallenge[]>(DEFAULT_CHALLENGES);
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const challenge = challenges[activeChallengeIdx] || challenges[0];

  const [collectedQuantities, setCollectedQuantities] = useState<{ [key: string]: number }>({});
  const [stage, setStage] = useState<'collecting' | 'paying' | 'checking_change' | 'completed'>('collecting');

  const [paidItems, setPaidItems] = useState<{ type: CurrencyType; id: string }[]>([]);
  const [walletCounts, setWalletCounts] = useState<{ [key in CurrencyType]: number }>({
    '1': 10,
    '5': 5,
    '10': 10,
    '50': 4,
    '100': 4,
    '500': 1,
  });

  const [selectedPhrase, setSelectedPhrase] = useState('');

  // Target item details
  const targetDetails = challenge.itemsNeeded.map(item => {
    const prod = PRODUCTS.find(p => p.id === item.productId) || PRODUCTS[0];
    const currentQty = collectedQuantities[item.productId] || 0;
    return {
      product: prod,
      targetQuantity: item.targetQuantity,
      currentQuantity: currentQty,
      isFulfilled: currentQty >= item.targetQuantity,
    };
  });

  const allItemsCollected = targetDetails.every(d => d.isFulfilled);

  const totalPrice = targetDetails.reduce(
    (sum, d) => sum + d.product.price * d.currentQuantity,
    0
  );

  const totalPaid = paidItems.reduce((sum, item) => sum + parseInt(item.type, 10), 0);
  const expectedChange = totalPaid - totalPrice;

  const recommendation = getRecommendedPayment(totalPrice);

  const handleAddCustomChallenge = (newChallenge: CustomChallenge) => {
    setChallenges(prev => [...prev, newChallenge]);
    setActiveChallengeIdx(challenges.length); // switch to the new one
    setStage('collecting');
    setCollectedQuantities({});
  };

  const handleAdjustItem = (productId: string, delta: number) => {
    playTone('click');
    setCollectedQuantities(prev => {
      const current = prev[productId] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [productId]: updated };
    });
    const prod = PRODUCTS.find(p => p.id === productId);
    if (prod) speakText(`調整 ${prod.name} 數量`);
  };

  const handleGoToCheckout = () => {
    if (!allItemsCollected) return;
    setStage('paying');
    setPaidItems([]);
    setWalletCounts(generateVariedWalletForPrice(totalPrice));
    speakText(`清單商品收集齊全！總共 ${totalPrice} 元。準備付款！`);
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
    const newWallet = { ...walletCounts };
    paidItems.forEach(item => {
      newWallet[item.type] = (newWallet[item.type] || 0) + 1;
    });
    setWalletCounts(newWallet);
    setPaidItems([]);
  };

  const handleConfirmPayment = () => {
    if (totalPaid < totalPrice) return;
    setStage('checking_change');
    speakText(`收到您 ${totalPaid} 元！遞給您找零 ${expectedChange} 元！`);
  };

  const handleVerifiedChange = (isSuccess: boolean, userSaidPhrase: boolean) => {
    setStage('completed');
    onEarnStar();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

    onRecordStep({
      id: `${Date.now()}`,
      timestamp: new Date(),
      mode: 'advanced',
      missionTitle: challenge.title,
      totalPrice,
      paidAmount: totalPaid,
      expectedChange,
      actualGivenChange: expectedChange,
      isWrongChangeScenario: false,
      userDetectedWrongChangeCorrectly: true,
      userSaidPhraseCorrectly: userSaidPhrase,
      paymentCorrect: true,
      scaffoldingUsed: scaffoldingLevel,
      score: 100,
    });
  };

  const handleNextChallenge = () => {
    setStage('collecting');
    setCollectedQuantities({});
    setPaidItems([]);
    if (activeChallengeIdx < challenges.length - 1) {
      setActiveChallengeIdx(prev => prev + 1);
    } else {
      setActiveChallengeIdx(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Tabs for Challenges & Custom Creation Trigger */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 md:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="font-black text-lg md:text-xl text-slate-900">多項採買清單挑戰 (生活情境特訓)</h2>
              <p className="text-xs text-slate-500 font-bold">符合特教學童家庭與學校生活經驗，支援老師/家長自訂題目</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-2xl text-xs md:text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95 border-2 border-amber-300 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>🛠️ 家長/教師自訂出題</span>
          </button>
        </div>

        {/* Horizontal Scenario Selection Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {challenges.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                playTone('click');
                setActiveChallengeIdx(idx);
                setStage('collecting');
                setCollectedQuantities({});
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border-2 shrink-0 ${
                activeChallengeIdx === idx
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {ch.title}
              {ch.isCustom && <span className="ml-1 text-[10px] bg-purple-700 text-white px-1.5 py-0.5 rounded-full">自訂</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Task Card */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50/20 to-amber-100/30 border-3 border-amber-300 rounded-3xl p-5 md:p-6 shadow-xl space-y-5">
        <div className="bg-white border-3 border-amber-300 rounded-2xl p-4 shadow-md flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                任務 {activeChallengeIdx + 1}
              </span>
              <h3 className="font-black text-xl text-amber-950">{challenge.title}</h3>
            </div>
            <p className="text-xs md:text-sm text-amber-900 font-black mt-1">{challenge.subtitle}</p>
          </div>
          <div className="bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl font-black text-xs text-amber-900">
            預算約: ${challenge.budget} 元
          </div>
        </div>

        {stage === 'collecting' && (
          <div className="space-y-6">
            {/* Shopping List Progress */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-black text-base text-slate-800 flex items-center gap-2">
                <span>📋 購物清單核對 (點擊 +/- 調整數量)：</span>
              </h4>

              <div className="space-y-3">
                {targetDetails.map(d => (
                  <div
                    key={d.product.id}
                    className={`p-4 rounded-2xl border-3 flex items-center justify-between transition-all ${
                      d.isFulfilled
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {d.isFulfilled ? (
                        <CheckSquare className="w-6 h-6 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400 shrink-0" />
                      )}
                      <span className="text-4xl">{d.product.image}</span>
                      <div>
                        <h5 className="font-black text-base md:text-lg">{d.product.name}</h5>
                        <div className="text-xs md:text-sm font-extrabold text-slate-600">
                          單價 ${d.product.price} 元 | 目標需求：{d.targetQuantity} 件
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-300 shadow-xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustItem(d.product.id, -1)}
                        className="w-9 h-9 rounded-xl bg-slate-200 font-black text-slate-800 hover:bg-slate-300 active:scale-95 flex items-center justify-center text-base"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-black text-lg md:text-xl text-amber-950">
                        {d.currentQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustItem(d.product.id, 1)}
                        className="w-9 h-9 rounded-xl bg-amber-400 font-black text-slate-950 hover:bg-amber-500 active:scale-95 flex items-center justify-center text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Price Bar */}
              <div className="mt-4 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="bg-amber-100/80 px-4 py-2 rounded-2xl border border-amber-300 w-full sm:w-auto">
                  <span className="text-xs text-amber-900 font-black block">清單商品總計金額：</span>
                  <span className="text-3xl font-black text-amber-950">${totalPrice} 元</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  disabled={!allItemsCollected}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base text-white transition-all shadow-xl flex items-center justify-center gap-2 ${
                    allItemsCollected
                      ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer animate-bounce'
                      : 'bg-slate-300 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>清單數量齊全！去收銀台結帳</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage: Paying or Checking Change */}
        {(stage === 'paying' || stage === 'checking_change') && (
          <div className="space-y-5">
            <ClerkDialog
              clerkText={
                stage === 'paying'
                  ? `您好！幫您結帳清單上的商品，總共是 ${totalPrice} 元！`
                  : `收您 ${totalPaid} 元，找零 ${expectedChange} 元，謝謝您！`
              }
              expectedChange={expectedChange}
              onSelectPhrase={(phrase) => setSelectedPhrase(phrase)}
              selectedPhrase={selectedPhrase}
            />

            <CashierTray
              paidItems={paidItems}
              totalPaid={totalPaid}
              requiredPrice={totalPrice}
              onRemoveItem={handleRemoveMoney}
              onClearTray={handleClearTray}
              onConfirmPayment={handleConfirmPayment}
              disabled={stage === 'checking_change'}
            />

            {stage === 'paying' && (
              <WalletTray
                walletCounts={walletCounts}
                onAddMoney={handleAddMoney}
                onResetWallet={() => setWalletCounts(generateVariedWalletForPrice(totalPrice))}
                scaffoldingLevel={scaffoldingLevel}
                recommendedType={recommendation.coins[0]?.type}
              />
            )}

            {stage === 'checking_change' && (
              <div className="space-y-4">
                {scaffoldingLevel <= 2 && (
                  <PaperMathHelper
                    paidAmount={totalPaid}
                    priceAmount={totalPrice}
                    expectedChange={expectedChange}
                  />
                )}

                <ChangeChecker
                  paidAmount={totalPaid}
                  totalPrice={totalPrice}
                  expectedChange={expectedChange}
                  actualGivenChange={expectedChange}
                  isWrongChangeScenario={false}
                  scaffoldingLevel={scaffoldingLevel}
                  onVerified={handleVerifiedChange}
                />
              </div>
            )}
          </div>
        )}

        {stage === 'completed' && (
          <div className="bg-white border-4 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-20 h-20 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-4xl mx-auto font-black shadow-md">
              🏆
            </div>
            <h3 className="font-black text-2xl md:text-3xl text-slate-900">恭喜完成採買任務【{challenge.title}】！</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto font-bold">
              成功對照購物清單、精確算出 ${totalPrice} 元總金額並順利付錢找零！
            </p>

            <button
              type="button"
              onClick={handleNextChallenge}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-2xl text-base transition-all shadow-xl inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>挑戰下一個購物清單任務</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Teacher/Parent Custom Scenario Creation Modal */}
      <CustomScenarioModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddChallenge={handleAddCustomChallenge}
      />
    </div>
  );
};

