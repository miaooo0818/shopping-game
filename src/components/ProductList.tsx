import React, { useState } from 'react';
import { CategoryType, Product } from '../types';
import { PRODUCTS } from '../data/items';
import { ShoppingBag, Plus, Volume2, Search, Check } from 'lucide-react';
import { speakText } from '../utils/speech';

interface ProductListProps {
  onAddToCart: (product: Product) => void;
  selectedProductIds?: string[];
  title?: string;
  subtitle?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  onAddToCart,
  selectedProductIds = [],
  title = '便利商店商品貨架 (點擊挑選商品)',
  subtitle = '圖像化視覺貨架，點擊商品即可放入購物車',
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType | '全部'>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories: (CategoryType | '全部')[] = ['全部', '飲料', '鮮食', '零食', '文具', '生活用品'];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === '全部' || p.category === activeCategory;
    const matchesSearch = p.name.includes(searchQuery) || p.price.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    speakText(`選購 ${product.name}，價格 ${product.price} 元`);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 800);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-lg">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
        <div>
          <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">🛒</span>
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-48">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋商品/價格..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredProducts.map((product) => {
          const isSelected = selectedProductIds.includes(product.id);
          const isJustAdded = addedAnimationId === product.id;

          return (
            <div
              key={product.id}
              className={`bg-gradient-to-b from-slate-50 to-white border-2 rounded-2xl p-3 flex flex-col justify-between transition-all hover:shadow-md relative group ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Product Badge */}
              {product.badge && (
                <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                  {product.badge}
                </span>
              )}

              {/* Speak button */}
              <button
                type="button"
                onClick={() => speakText(`${product.name}，${product.price}元`)}
                className="absolute top-2 right-2 text-slate-400 hover:text-emerald-700 p-1 rounded-lg hover:bg-slate-100"
                title="發音"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              {/* Product Image Icon */}
              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-5xl transform group-hover:scale-110 transition-transform mb-2">
                  {product.image}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 text-center leading-tight">
                  {product.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 text-center">
                  {product.description}
                </p>
              </div>

              {/* Price Tag & Action */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs text-slate-500 font-bold">$</span>
                  <span className="text-lg font-black text-amber-600">{product.price}</span>
                  <span className="text-xs text-slate-500 font-bold">元</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className={`p-2 rounded-xl font-bold transition-all flex items-center gap-1 shadow-sm ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white scale-110'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                  }`}
                  title="放入購物車"
                >
                  {isJustAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
