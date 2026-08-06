import { CurrencyItem, CurrencyType } from '../types';

export const CURRENCIES: CurrencyItem[] = [
  {
    value: 1,
    type: '1',
    name: '1元',
    isBill: false,
    color: '#b87333', // Copper / Bronze color
    bgColor: 'bg-amber-700',
    textColor: 'text-amber-100',
  },
  {
    value: 5,
    type: '5',
    name: '5元',
    isBill: false,
    color: '#94a3b8', // Silver light
    bgColor: 'bg-slate-400',
    textColor: 'text-slate-900',
  },
  {
    value: 10,
    type: '10',
    name: '10元',
    isBill: false,
    color: '#64748b', // Silver dark
    bgColor: 'bg-slate-500',
    textColor: 'text-white',
  },
  {
    value: 50,
    type: '50',
    name: '50元',
    isBill: false,
    color: '#eab308', // Gold
    bgColor: 'bg-amber-400',
    textColor: 'text-amber-950',
  },
  {
    value: 100,
    type: '100',
    name: '100元',
    isBill: true,
    color: '#dc2626', // Red bill (Sun Yat-sen)
    bgColor: 'bg-red-600',
    textColor: 'text-white',
  },
  {
    value: 500,
    type: '500',
    name: '500元',
    isBill: true,
    color: '#854d0e', // Brown bill (Baseball team)
    bgColor: 'bg-amber-800',
    textColor: 'text-amber-100',
  },
];

/**
 * Calculates optimal change breakdown for NTD amounts (Greedy coin change)
 * e.g., $65 -> 50x1, 10x1, 5x1
 */
export function calculateOptimalChange(amount: number): { [key in CurrencyType]?: number } {
  let remaining = amount;
  const result: { [key in CurrencyType]?: number } = {};

  const values: { type: CurrencyType; val: number }[] = [
    { type: '500', val: 500 },
    { type: '100', val: 100 },
    { type: '50', val: 50 },
    { type: '10', val: 10 },
    { type: '5', val: 5 },
    { type: '1', val: 1 },
  ];

  for (const { type, val } of values) {
    if (remaining >= val) {
      const count = Math.floor(remaining / val);
      result[type] = count;
      remaining %= val;
    }
  }

  return result;
}

/**
 * Recommends optimal cash payment for a given price from available wallet
 * e.g., For $35, recommends $50 coin or 4x $10 coins
 */
export function getRecommendedPayment(price: number): { amount: number; description: string; coins: { type: CurrencyType; count: number }[] } {
  if (price <= 10) {
    return {
      amount: 10,
      description: '拿 1 個 10 元硬幣',
      coins: [{ type: '10', count: 1 }]
    };
  }
  if (price <= 50) {
    return {
      amount: 50,
      description: '拿 1 個 50 元硬幣（或 5 個 10 元）',
      coins: [{ type: '50', count: 1 }]
    };
  }
  if (price <= 100) {
    return {
      amount: 100,
      description: '拿 1 張 100 元鈔票',
      coins: [{ type: '100', count: 1 }]
    };
  }
  if (price <= 200) {
    return {
      amount: 200,
      description: '拿 2 張 100 元鈔票',
      coins: [{ type: '100', count: 2 }]
    };
  }
  if (price <= 500) {
    return {
      amount: 500,
      description: '拿 1 張 500 元鈔票',
      coins: [{ type: '500', count: 1 }]
    };
  }
  return {
    amount: Math.ceil(price / 100) * 100,
    description: `拿 ${Math.ceil(price / 100)} 張 100 元鈔票`,
    coins: [{ type: '100', count: Math.ceil(price / 100) }]
  };
}

/**
 * Generates randomized, price-tailored initial wallet coin and banknote counts.
 * Prevents giving oversized denominations (e.g. $500 bill for a $15 item).
 * Varies slightly on every question for realistic shopping practice.
 */
export function generateVariedWalletForPrice(price: number): { [key in CurrencyType]: number } {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (price <= 25) {
    // For cheap items ($1 - $25):
    // 1元: 4~8, 5元: 2~4, 10元: 3~6, 50元: 1~2, 100元: 1, 500元: 0
    return {
      '1': rand(4, 8),
      '5': rand(2, 4),
      '10': rand(3, 6),
      '50': rand(1, 2),
      '100': 1,
      '500': 0, // No $500 bill for small purchases!
    };
  }

  if (price <= 80) {
    // For medium items ($26 - $80):
    // 1元: 3~7, 5元: 2~5, 10元: 4~8, 50元: 1~3, 100元: 1~2, 500元: 0
    return {
      '1': rand(3, 7),
      '5': rand(2, 5),
      '10': rand(4, 8),
      '50': rand(1, 3),
      '100': rand(1, 2),
      '500': 0, // No $500 bill needed
    };
  }

  if (price <= 200) {
    // For $81 - $200 items:
    // 1元: 3~6, 5元: 2~4, 10元: 3~6, 50元: 2~4, 100元: 2~4, 500元: 0 or 1
    return {
      '1': rand(3, 6),
      '5': rand(2, 4),
      '10': rand(3, 6),
      '50': rand(2, 4),
      '100': rand(2, 4),
      '500': Math.random() > 0.8 ? 1 : 0,
    };
  }

  // For $201+ items:
  return {
    '1': rand(3, 6),
    '5': rand(2, 4),
    '10': rand(4, 8),
    '50': rand(2, 4),
    '100': rand(3, 6),
    '500': 1,
  };
}
