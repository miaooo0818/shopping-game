import { Mission } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 'mission_1',
    title: '關卡一：買蘋果牛奶',
    subtitle: '準備買一瓶最愛的蘋果牛奶！',
    description: '你想買一瓶 35 元的蘋果牛奶。請從錢包拿出一張 50 元付給店員，並算算看店員應該找你多少錢。',
    targetItems: [{ productId: 'apple_milk', quantity: 1 }],
    forcedPayment: 50,
    isWrongChangeScenario: false,
    difficulty: '簡單',
    icon: '🧃'
  },
  {
    id: 'mission_wrong_1',
    title: '關卡二：店員找錯錢應對',
    subtitle: '當店員找錯錢時，大聲說出口訣！',
    description: '你買了 35 元的蘋果牛奶，拿 50 元給店員。但是店員只找給你 10 元（應該找 15 元）！請確認找零，並勇敢說出「找錯錢了！」。',
    targetItems: [{ productId: 'apple_milk', quantity: 1 }],
    forcedPayment: 50,
    isWrongChangeScenario: true,
    wrongChangeAmount: 10,
    targetScript: '找錯錢了！',
    difficulty: '簡單',
    icon: '⚠️'
  },
  {
    id: 'mission_3',
    title: '關卡三：買香氣茶葉蛋',
    subtitle: '練習十位數與個位數找零計算',
    description: '肚子餓了想吃茶葉蛋（13元），拿一張 50 元付錢，練習心算或用步驟卡算找零。',
    targetItems: [{ productId: 'tea_egg', quantity: 1 }],
    forcedPayment: 50,
    isWrongChangeScenario: false,
    difficulty: '簡單',
    icon: '🥚'
  },
  {
    id: 'mission_4',
    title: '關卡四：買兩樣點心',
    subtitle: '御飯糰 30元 + 蘋果牛奶 35元 = 65元',
    description: '拿一張 100 元鈔票付款（65元）。算算看 100 減掉 65 等於多少？店員應該找你多少錢？',
    targetItems: [
      { productId: 'tuna_onigiri', quantity: 1 },
      { productId: 'apple_milk', quantity: 1 }
    ],
    forcedPayment: 100,
    isWrongChangeScenario: false,
    difficulty: '中等',
    icon: '🍱'
  },
  {
    id: 'mission_wrong_2',
    title: '關卡五：百元鈔找錯錢應對',
    subtitle: '買 75元 便當拿 100元，店員誤找 15元',
    description: '便當 75 元，你拿 100 元付錢，應該找 25 元。但店員粗心只找了 15 元！請檢查並按口訣「找錯錢了！」。',
    targetItems: [{ productId: 'bento_chicken', quantity: 1 }],
    forcedPayment: 100,
    isWrongChangeScenario: true,
    wrongChangeAmount: 15,
    targetScript: '找錯錢了！',
    difficulty: '中等',
    icon: '🚨'
  },
  {
    id: 'mission_6',
    title: '關卡六：買學習文具組',
    subtitle: '2B鉛筆 15元 + 橡皮擦 12元',
    description: '準備上課需要的文具，總共 27 元。這次請自己從錢包裡挑選足夠的錢付給店員！',
    targetItems: [
      { productId: 'pencil_2b', quantity: 1 },
      { productId: 'eraser', quantity: 1 }
    ],
    isWrongChangeScenario: false,
    difficulty: '挑戰',
    icon: '✏️'
  }
];
