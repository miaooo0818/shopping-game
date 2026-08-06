import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // --- 飲料類 ---
  {
    id: 'apple_milk',
    name: '國農蘋果牛奶',
    price: 35,
    category: '飲料',
    image: '🧃',
    badge: '熱門首選',
    description: '香甜順口的經典蘋果調味乳 35元'
  },
  {
    id: 'maikang_tea',
    name: '麥香奶茶 (300ml)',
    price: 15,
    category: '飲料',
    image: '🧃',
    badge: '銅板價',
    description: '熟悉的經典麥香風味奶茶 15元'
  },
  {
    id: 'yakult',
    name: '養樂多發酵乳',
    price: 12,
    category: '飲料',
    image: '🍼',
    description: '幫助消化人氣發酵乳 12元'
  },
  {
    id: 'orange_juice',
    name: '百分百柳橙汁',
    price: 28,
    category: '飲料',
    image: '🍊',
    description: '新鮮壓榨原汁，補充維生素 C 28元'
  },
  {
    id: 'fresh_milk',
    name: '全脂鮮乳 (小瓶)',
    price: 40,
    category: '飲料',
    image: '🥛',
    description: '濃純香優質鮮乳，補充滿滿鈣質 40元'
  },
  {
    id: 'latte_coffee',
    name: '現煮拿鐵咖啡 (中)',
    price: 45,
    category: '飲料',
    image: '☕',
    badge: '熱賣飲品',
    description: '現磨濃縮咖啡搭配優質鮮奶 45元'
  },
  {
    id: 'mineral_water',
    name: '鹼性離子水',
    price: 20,
    category: '飲料',
    image: '💧',
    description: '甘甜順口純淨瓶裝水 20元'
  },
  {
    id: 'sports_drink',
    name: '舒跑運動飲料',
    price: 25,
    category: '飲料',
    image: '🏃‍♂️',
    description: '迅速補充水分與電解質 25元'
  },
  {
    id: 'boba_tea',
    name: '黑糖珍珠奶茶',
    price: 55,
    category: '飲料',
    image: '🧋',
    badge: '人氣特調',
    description: '濃郁黑糖搭配Q彈珍珠 55元'
  },

  // --- 鮮食類 ---
  {
    id: 'tea_egg',
    name: '香氣茶葉蛋',
    price: 13,
    category: '鮮食',
    image: '🥚',
    badge: '超商必買',
    description: '入味香醇便利商店經典茶葉蛋 13元'
  },
  {
    id: 'tuna_onigiri',
    name: '鮪魚御飯糰',
    price: 30,
    category: '鮮食',
    image: '🍙',
    badge: '熱賣早餐',
    description: '海苔酥脆，內餡滿滿鮪魚沙拉 30元'
  },
  {
    id: 'pork_onigiri',
    name: '香鬆肉鬆飯糰',
    price: 30,
    category: '鮮食',
    image: '🍙',
    description: '鹹香肉鬆搭配美味越光米 30元'
  },
  {
    id: 'hot_dog',
    name: '爆漿起司熱狗',
    price: 35,
    category: '鮮食',
    image: '🌭',
    badge: '熟食推薦',
    description: '香濃起司夾心多汁熱狗 35元'
  },
  {
    id: 'strawberry_sandwich',
    name: '草莓夾心三明治',
    price: 35,
    category: '鮮食',
    image: '🥪',
    description: '香甜草莓醬搭配柔軟吐司 35元'
  },
  {
    id: 'bento_chicken',
    name: '照燒雞腿便當',
    price: 75,
    category: '鮮食',
    image: '🍱',
    badge: '正餐推薦',
    description: '大雞腿搭配豐盛配菜與白飯 75元'
  },
  {
    id: 'curry_rice',
    name: '佛蒙特咖哩飯',
    price: 85,
    category: '鮮食',
    image: '🍛',
    description: '濃郁甘口咖哩搭配嫩豬肉塊 85元'
  },
  {
    id: 'pork_bun',
    name: '鮮肉大包子',
    price: 25,
    category: '鮮食',
    image: '🥟',
    description: '皮Q餡多汁熱騰騰大肉包 25元'
  },
  {
    id: 'pudding',
    name: '統一大布丁',
    price: 25,
    category: '鮮食',
    image: '🍮',
    badge: '經典甜點',
    description: '滑嫩雞蛋布丁搭香濃焦糖 25元'
  },
  {
    id: 'soft_cream',
    name: '特濃霜淇淋',
    price: 49,
    category: '鮮食',
    image: '🍦',
    description: '濃郁奶香現抽美味霜淇淋 49元'
  },

  // --- 零食類 ---
  {
    id: 'potato_chips',
    name: '樂事原味洋芋片',
    price: 35,
    category: '零食',
    image: '🥔',
    badge: '人氣零食',
    description: '薄脆香濃經典切片洋芋片 35元'
  },
  {
    id: 'puff_cake',
    name: '義美巧克力泡芙',
    price: 35,
    category: '零食',
    image: '🧁',
    description: '酥脆外皮包裹濃郁巧克力 35元'
  },
  {
    id: 'science_noodle',
    name: '統一科學麵',
    price: 10,
    category: '零食',
    image: '🍜',
    badge: '銅板價',
    description: '香脆可口古早味童年點心 10元'
  },
  {
    id: 'chocolate_biscuit',
    name: '巧克力夾心餅乾',
    price: 25,
    category: '零食',
    image: '🍪',
    description: '酥脆餅乾包裹夾心巧克力 25元'
  },
  {
    id: 'gummy_candy',
    name: '水果QQ軟糖',
    price: 20,
    category: '零食',
    image: '🍬',
    description: '綜合水果風味嚼勁軟糖 20元'
  },
  {
    id: 'pocky_stick',
    name: 'Pocky 巧克力棒',
    price: 38,
    category: '零食',
    image: '🥢',
    description: '脆餅棒沾裹濃郁巧克力醬 38元'
  },
  {
    id: 'popcorn',
    name: '焦糖爆米花',
    price: 30,
    category: '零食',
    image: '🍿',
    description: '甜而不膩香脆焦糖爆米花 30元'
  },

  // --- 文具類 ---
  {
    id: 'pencil_2b',
    name: '2B 木質鉛筆',
    price: 15,
    category: '文具',
    image: '✏️',
    description: '好寫易擦，學習寫字必備 15元'
  },
  {
    id: 'eraser',
    name: '無毒潔淨橡皮擦',
    price: 12,
    category: '文具',
    image: '🧹',
    description: '集屑力強，擦拭乾淨不留痕 12元'
  },
  {
    id: 'notebook',
    name: '可愛圖案作業簿',
    price: 25,
    category: '文具',
    image: '📓',
    description: '九宮格/橫線畫冊作業本 25元'
  },
  {
    id: 'ruler',
    name: '15cm 透明直尺',
    price: 15,
    category: '文具',
    image: '📏',
    description: '刻度清晰，上課畫線實用 15元'
  },
  {
    id: 'ballpoint_pen',
    name: '按壓式三色原子筆',
    price: 25,
    category: '文具',
    image: '🖊️',
    description: '紅藍黑三色合一方便筆記 25元'
  },

  // --- 生活用品類 ---
  {
    id: 'tissue_paper',
    name: '隨身袖珍包面紙(3入)',
    price: 15,
    category: '生活用品',
    image: '🧻',
    description: '柔軟貼心，外出攜帶便利 15元'
  },
  {
    id: 'wet_wipes',
    name: '純水濕紙巾(隨身包)',
    price: 29,
    category: '生活用品',
    image: '🧼',
    description: '無酒精溫和潔淨濕紙巾 29元'
  },
  {
    id: 'band_aid',
    name: '隨身 OK 繃 (5片)',
    price: 20,
    category: '生活用品',
    image: '🩹',
    description: '透氣保護小傷口隨身備用 20元'
  },
  {
    id: 'mask',
    name: '3D 立體口罩 (3入)',
    price: 35,
    category: '生活用品',
    image: '😷',
    description: '舒適透氣貼合面部防護 35元'
  }
];

