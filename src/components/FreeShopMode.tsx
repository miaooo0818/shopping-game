import React, { useState } from 'react';
import { CartItem, CurrencyType, Product, ScaffoldingLevel, StepRecord } from '../types';
import { ProductList } from './ProductList';
import { WalletTray } from './WalletTray';
import { CashierTray } from './CashierTray';
import { PaperMathHelper } from './PaperMathHelper';
import { ChangeChecker } from './ChangeChecker';
import { getRecommendedPayment, generateVariedWalletForPrice } from '../data/currency';
import { speakText } from '../utils/speech';
import { ShoppingCart, Trash2, ArrowRight, RefreshCcw, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FreeShopModeProps {
  scaffoldingLevel: ScaffoldingLevel;
  onRecordStep: (record: StepRecord) => void;
  onEarnStar: () => void;
}

export const FreeShopMode: React.FC<FreeShopModeProps> = ({
  scaffoldingLevel,
  onRecordStep,
  onEarnStar,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stage, setStage] = useState<'selecting' | 'paying' | 'checking_change' | 'completed'>('selecting');

  const [simulateWrongChange, setSimulateWrongChange] = useState(false);

  // Cashier payment state
  const [paidItems, setPaidItems] = useState<{ type: CurrencyType; id: string }[]>([]);
  const [walletCounts, setWalletCounts] = useState<{ [key in CurrencyType]: number }>({
    '1': 10,
    '5': 5,
    '10': 10,
    '50': 4,
    '100': 3,
    '500': 1,
  });

  const [selectedPhrase, setSelectedPhrase] = useState('');

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalPaid = paidItems.reduce((sum, item) => sum + parseInt(item.type, 10), 0);
  const expectedChange = totalPaid - totalPrice;

  const actualGivenChange = simulateWrongChange ? Math.max(0, expectedChange - 10) : expectedChange;

  const recommendation = getRecommendedPayment(totalPrice);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    setStage('paying');
    setPaidItems([]);
    setWalletCounts(generateVariedWalletForPrice(totalPrice));
    speakText(`準備結帳囉！購物車共有 ${cart.length} 件商品，總金額 ${totalPrice} 元。請從錢包拿錢。`);
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
    speakText(`收到您 ${totalPaid} 元！遞給您找零 ${actualGivenChange} 元！`);
  };

  const handleVerifiedChange = (isSuccess: boolean, userSaidPhrase: boolean) => {
    setStage('completed');
    onEarnStar();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    onRecordStep({
      id: `${Date.now()}`,
      timestamp: new Date(),
      mode: 'free',
      missionTitle: '自由購物練習',
      totalPrice,
      paidAmount: totalPaid,
      expectedChange,
      actualGivenChange,
      isWrongChangeScenario: simulateWrongChange,
      userDetectedWrongChangeCorrectly: isSuccess,
      userSaidPhraseCorrectly: userSaidPhrase || selectedPhrase === '找錯錢了！',
      paymentCorrect: true,
      scaffoldingUsed: scaffoldingLevel,
      score: 100,
    });
  };

  const handleResetAll = () => {
    setCart([]);
    setPaidItems([]);
    setStage('selecting');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Top Banner & Wrong Change Simulation Toggle */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-xl text-slate-900 flex items-center gap-2">
            <span>🛒 自由選購便利商店</span>
          </h2>
          <p className="text-xs text-slate-500">自由挑選想買的商品，練習看價格、付款與確認找零</p>
        </div>

        {/* Option to trigger random wrong change */}
        <button
          type="button"
          onClick={() => setSimulateWrongChange(!simulateWrongChange)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
            simulateWrongChange
              ? 'bg-red-500 text-white border-red-600 shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>店員找錯錢對訓情境：{simulateWrongChange ? '已開啟 (測試中)' : '已關閉 (正常找零)'}</span>
        </button>
      </div>

      {stage === 'selecting' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Product Shelf */}
          <div className="lg:col-span-2">
            <ProductList
              onAddToCart={handleAddToCart}
              selectedProductIds={cart.map(c => c.product.id)}
            />
          </div>

          {/* Right Col: Shopping Cart */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">我的購物籃</h3>
                </div>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    清空
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-bold text-xs">
                  🛒 購物籃是空的喔！<br />點擊左側商品「+」按鈕即可放入。
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.product.image}</span>
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900">{item.product.name}</h4>
                          <span className="text-[11px] text-amber-700 font-black">
                            ${item.product.price} 元 x {item.quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer Total & Checkout */}
            <div className="mt-4 pt-3 border-t-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">總花費金額：</span>
                <span className="text-2xl font-black text-amber-600">${totalPrice} 元</span>
              </div>

              <button
                type="button"
                onClick={handleStartCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-2xl font-black text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                  cart.length > 0
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 cursor-pointer animate-pulse'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <span>帶購物籃前往結帳處</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage: Paying or Checking Change */}
      {(stage === 'paying' || stage === 'checking_change') && (
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border-2 border-emerald-200 rounded-3xl p-5 md:p-6 shadow-xl space-y-6">
          {/* Question / Cart Summary Header - Enlarged Display for High Readability */}
          <div className="bg-white border-4 border-emerald-400 rounded-3xl p-5 md:p-6 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shrink-0 border-2 border-amber-300 shadow-md">
                🛒
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-2xl md:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                  自由超市結帳題目
                </h3>
                <p className="text-base md:text-lg font-black text-amber-950">
                  請將右側對應總金額的硬幣與鈔票放上收銀台托盤
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 px-5 py-4 rounded-3xl border-2 border-emerald-300 flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto shrink-0 justify-between">
              <div>
                <span className="text-xs md:text-sm font-black text-slate-600 block mb-1">購物籃內商品 ({cart.length} 件)：</span>
                <div className="flex flex-wrap items-center gap-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border-2 border-slate-200 text-sm md:text-base font-black shadow-xs">
                      <span className="text-2xl md:text-3xl">{item.product.image}</span>
                      <span className="text-slate-900">{item.product.name}</span>
                      <span className="text-amber-700 font-black">${item.product.price} x {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l-2 border-emerald-200 pt-3 sm:pt-0 sm:pl-5 w-full sm:w-auto">
                <span className="text-xs md:text-sm font-black text-slate-600 block">結帳應付總額</span>
                <div className="text-3xl md:text-5xl font-black text-amber-600 tracking-tight">${totalPrice} 元</div>
              </div>
            </div>
          </div>

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
                actualGivenChange={actualGivenChange}
                isWrongChangeScenario={simulateWrongChange}
                scaffoldingLevel={scaffoldingLevel}
                onVerified={handleVerifiedChange}
              />
            </div>
          )}
        </div>
      )}

      {stage === 'completed' && (
        <div className="bg-white border-4 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-3xl mx-auto font-black shadow-md">
            🎉
          </div>
          <h3 className="font-black text-2xl text-slate-900">成功完成自由購物體驗！</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto font-bold">
            買了 {cart.length} 件商品（總花費 ${totalPrice} 元），正確收齊找零！
          </p>

          <button
            type="button"
            onClick={handleResetAll}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>繼續自由購物選購</span>
          </button>
        </div>
      )}
    </div>
  );
};
