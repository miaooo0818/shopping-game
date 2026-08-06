import React, { useState } from 'react';
import { PRODUCTS } from '../data/items';
import { Product } from '../types';
import { X, Plus, Trash2, Sparkles, Check, BookOpen } from 'lucide-react';
import { playTone, speakText } from '../utils/speech';

export interface CustomChallenge {
  id: string;
  title: string;
  subtitle: string;
  budget: number;
  itemsNeeded: { productId: string; targetQuantity: number }[];
  isCustom?: boolean;
}

interface CustomScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChallenge: (challenge: CustomChallenge) => void;
}

export const CustomScenarioModal: React.FC<CustomScenarioModalProps> = ({
  isOpen,
  onClose,
  onAddChallenge,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ productId: string; targetQuantity: number }[]>([
    { productId: 'tea_egg', targetQuantity: 1 },
  ]);

  if (!isOpen) return null;

  const handleAddItemRow = () => {
    playTone('click');
    setSelectedItems(prev => [...prev, { productId: 'apple_milk', targetQuantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (selectedItems.length <= 1) return;
    playTone('remove');
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, productId: string, targetQuantity: number) => {
    setSelectedItems(prev => {
      const updated = [...prev];
      updated[index] = { productId, targetQuantity: Math.max(1, targetQuantity) };
      return updated;
    });
  };

  // Calculate total price based on selected items
  const totalPrice = selectedItems.reduce((sum, item) => {
    const prod = PRODUCTS.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.targetQuantity : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('請輸入題目名稱喔！');
      return;
    }

    const newChallenge: CustomChallenge = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `自訂題目，總共計 $${totalPrice} 元`,
      budget: Math.ceil(totalPrice / 100) * 100 + 100,
      itemsNeeded: selectedItems,
      isCustom: true,
    };

    playTone('success');
    speakText(`成功新增自訂購物出題：${title}`);
    onAddChallenge(newChallenge);
    onClose();

    // Reset form
    setTitle('');
    setSubtitle('');
    setSelectedItems([{ productId: 'tea_egg', targetQuantity: 1 }]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl max-w-2xl w-full p-6 md:p-8 text-white shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full border border-slate-700 transition-colors"
          title="關閉"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Title */}
        <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full font-black text-sm shadow-md">
            <BookOpen className="w-4 h-4" />
            <span>家長 / 教師專用出題工具</span>
          </div>
          <h2 className="text-2xl font-black text-amber-300">
            🛠️ 設計生活採買任務 (自訂出題)
          </h2>
          <p className="text-xs text-slate-300">
            依據學童在家庭或學校的生活經驗，自由調整採買品項與數量！
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title input */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-amber-300 uppercase tracking-wider">
              任務名稱 (例：小明去全家買早餐)：
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例如：任務四：小明幫媽媽買早點"
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-bold placeholder:text-slate-500"
            />
          </div>

          {/* Subtitle input */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-amber-300 uppercase tracking-wider">
              情境說明 / 學習提示 (選填)：
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="例如：給予 100 元，請購買鮮乳 1 瓶與茶葉蛋 1 個"
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-bold placeholder:text-slate-500"
            />
          </div>

          {/* Items Selector List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-amber-300 uppercase tracking-wider">
                選擇題目中的採買商品：
              </label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>新增商品品項</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {selectedItems.map((item, idx) => {
                const prod = PRODUCTS.find(p => p.id === item.productId);

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-800 border-2 border-slate-700 p-3 rounded-2xl"
                  >
                    <span className="text-2xl">{prod?.image || '🛒'}</span>

                    {/* Product Dropdown */}
                    <select
                      value={item.productId}
                      onChange={e => handleUpdateItem(idx, e.target.value, item.targetQuantity)}
                      className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-xs md:text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.price} 元)
                        </option>
                      ))}
                    </select>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-bold">數量:</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.targetQuantity}
                        onChange={e =>
                          handleUpdateItem(idx, item.productId, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-14 bg-slate-900 border border-slate-600 rounded-xl px-2 py-1.5 text-center text-sm font-black text-amber-300"
                      />
                    </div>

                    {/* Delete row button */}
                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-xl transition-colors"
                        title="移除此品項"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Preview Box */}
          <div className="bg-slate-950 border-2 border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-black text-slate-300">自動計算題目總金額：</span>
            <span className="text-2xl font-black text-amber-400">${totalPrice} 元</span>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              取消
            </button>

            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-3 rounded-xl text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95"
            >
              <Check className="w-5 h-5" />
              <span>確認建立此題目</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
