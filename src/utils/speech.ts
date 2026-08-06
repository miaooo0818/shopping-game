// Web Speech API & Web Audio API synthesized sound effects helper for ASD learners

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

// Audio tone synthesizer for instant crisp sound feedback
export function playTone(type: 'coin' | 'success' | 'error' | 'click' | 'remove') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'coin') {
      // Crisp metallic coin drop sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'success') {
      // Joyful double chime
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } else if (type === 'error') {
      // Low dual warning buzz
      const now = ctx.currentTime;
      [220, 196].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.2);
      });
    } else if (type === 'remove') {
      // Soft pop back to wallet
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else {
      // Simple click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch {
    // Ignore audio context errors if browser blocks autoplay
  }
}

// Helper to convert numbers into natural spoken Chinese characters (e.g., "$25" -> "二十五元", "100" -> "一百")
function formatTextForNaturalChineseSpeech(rawText: string): string {
  // Replace currency formatting like "$25" or "$100" or "25元"
  let cleaned = rawText.replace(/\$\s*(\d+)\s*元?/g, (_, num) => {
    return `${convertNumberToChinese(parseInt(num, 10))}元`;
  }).replace(/(\d+)\s*元/g, (_, num) => {
    return `${convertNumberToChinese(parseInt(num, 10))}元`;
  });

  // Replace remaining standalone numbers
  cleaned = cleaned.replace(/\b(\d+)\b/g, (_, num) => {
    return convertNumberToChinese(parseInt(num, 10));
  });

  return cleaned
    .replace(/，/g, '， ')
    .replace(/！/g, '！ ')
    .replace(/。/g, '。 ')
    .replace(/：/g, '： ');
}

function convertNumberToChinese(num: number): string {
  if (isNaN(num)) return '';
  if (num === 0) return '零';
  if (num === 1) return '一';
  if (num === 5) return '五';
  if (num === 10) return '十';
  if (num === 50) return '五十';
  if (num === 100) return '一百';
  if (num === 500) return '五百';

  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  if (num < 10) return digits[num];

  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const tenStr = tens === 1 ? '十' : `${digits[tens]}十`;
    return ones === 0 ? tenStr : `${tenStr}${digits[ones]}`;
  }

  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    if (remainder === 0) return `${digits[hundreds]}百`;
    if (remainder < 10) return `${digits[hundreds]}百零${digits[remainder]}`;
    return `${digits[hundreds]}百${convertNumberToChinese(remainder)}`;
  }

  return num.toString();
}

export function speakText(text: string, onEnd?: () => void, rate: number = 0.88) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Convert raw numbers into clear natural Chinese words for maximum clarity
  const formattedText = formatTextForNaturalChineseSpeech(text);

  const utterance = new SpeechSynthesisUtterance(formattedText);
  utterance.lang = 'zh-TW';
  utterance.rate = rate; // 0.88 is steady, clear and easy for ASD children to follow
  utterance.pitch = 1.18; // Bright, warm, higher-pitched friendly tone
  utterance.volume = 1.0;

  // Try to find high-quality Taiwanese Chinese voice
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const twVoice = voices.find(
    v =>
      v.name.includes('Mei-Jia') ||
      v.name.includes('HsiaoChen') ||
      v.name.includes('Yating') ||
      v.name.includes('HanHan') ||
      v.lang.includes('zh-TW') ||
      v.lang.includes('zh_TW') ||
      v.lang.includes('cmn-Hant-TW') ||
      v.name.includes('Taiwan')
  ) || voices.find(v => v.lang.startsWith('zh'));

  if (twVoice) {
    utterance.voice = twVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

