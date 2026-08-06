export type CurrencyType = '1' | '5' | '10' | '50' | '100' | '500';

export interface CurrencyItem {
  value: number;
  type: CurrencyType;
  name: string;
  isBill: boolean;
  color: string;
  bgColor: string;
  textColor: string;
}

export type CategoryType = '飲料' | '鮮食' | '零食' | '文具' | '生活用品';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: CategoryType;
  image: string; // Emoji or SVG icon representation
  badge?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ScaffoldingLevel = 1 | 2 | 3; // 1: 完全提示 (提示錢幣與減法紙筆卡), 2: 部分提示, 3: 獨立挑戰 (無提示)

export type GameMode = 'mission' | 'free' | 'advanced' | 'report';

export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetItems: { productId: string; quantity: number }[];
  forcedPayment?: number; // E.g., 50 for $35 item
  isWrongChangeScenario?: boolean; // Force a wrong change to practice "找錯錢了！"
  wrongChangeAmount?: number; // Actual change given by clerk if wrong
  targetScript?: string; // E.g., "找錯錢了！"
  difficulty: '簡單' | '中等' | '挑戰';
  icon: string;
}

export interface StepRecord {
  id: string;
  timestamp: Date;
  mode: GameMode;
  missionTitle?: string;
  totalPrice: number;
  paidAmount: number;
  expectedChange: number;
  actualGivenChange: number;
  isWrongChangeScenario: boolean;
  userDetectedWrongChangeCorrectly: boolean;
  userSaidPhraseCorrectly: boolean; // Said/Clicked "找錯錢了！"
  paymentCorrect: boolean;
  scaffoldingUsed: ScaffoldingLevel;
  score: number;
}

export interface UserStats {
  totalMissionsCompleted: number;
  correctPayments: number;
  totalPaymentsAttempted: number;
  correctChangeDetections: number;
  totalChangeDetections: number;
  wrongChangeScriptPractices: number;
  starsEarned: number;
}
