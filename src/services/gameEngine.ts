import { LevelThreshold, QuestCategory, TimeTransaction, XpTransaction } from '../types';

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, title: 'Novice Explorer', minXp: 0, maxXp: 100, badge: '🌱' },
  { level: 2, title: 'Brave Pathfinder', minXp: 100, maxXp: 250, badge: '⚔️' },
  { level: 3, title: 'Skillful Adventurer', minXp: 250, maxXp: 500, badge: '🛡️' },
  { level: 4, title: 'Honor Guardian', minXp: 500, maxXp: 800, badge: '⭐' },
  { level: 5, title: 'Master Ranger', minXp: 800, maxXp: 1200, badge: '🔮' },
  { level: 6, title: 'Legendary Hero', minXp: 1200, maxXp: 1700, badge: '👑' },
  { level: 7, title: 'Grand Champion', minXp: 1700, maxXp: 999999, badge: '🏆' },
];

export function calculateLevel(totalXp: number) {
  const currentThreshold = [...LEVEL_THRESHOLDS]
    .reverse()
    .find((t) => totalXp >= t.minXp) || LEVEL_THRESHOLDS[0];

  const level = currentThreshold.level;
  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;
  const nextThreshold = isMaxLevel
    ? currentThreshold
    : LEVEL_THRESHOLDS.find((t) => t.level === level + 1)!;

  const xpInCurrentLevel = Math.max(0, totalXp - currentThreshold.minXp);
  const xpSpan = Math.max(1, nextThreshold.minXp - currentThreshold.minXp);
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.floor((xpInCurrentLevel / xpSpan) * 100));

  return {
    level,
    title: currentThreshold.title,
    badge: currentThreshold.badge,
    totalXp,
    currentLevelMinXp: currentThreshold.minXp,
    nextLevelXp: nextThreshold.minXp,
    xpToNextLevel: Math.max(0, nextThreshold.minXp - totalXp),
    progressPercent,
  };
}

/**
 * Komputasi saldo Time Wallet dari transaksi ledger
 * Menjamin prinsip append-only accounting dan saldo tidak negatif.
 */
export function computeTimeBalance(transactions: TimeTransaction[]): number {
  const sum = transactions.reduce((acc, curr) => acc + curr.minutes, 0);
  return Math.max(0, sum);
}

/**
 * Komputasi total XP dari transaksi ledger
 */
export function computeTotalXp(transactions: XpTransaction[]): number {
  return transactions.reduce((acc, curr) => acc + curr.amount, 0);
}

export const AVATAR_PRESETS = [
  {
    key: 'brave_knight',
    name: 'Ksatria Pemberani',
    emoji: '🦁',
    description: 'Tangguh dan selalu siap menolong keluarga.',
    bgColor: 'from-amber-400 to-orange-500',
  },
  {
    key: 'starlight_mage',
    name: 'Penyihir Bintang',
    emoji: '🧙‍♂️',
    description: 'Cerdas dan gemar membaca buku pengetahuan.',
    bgColor: 'from-indigo-400 to-purple-600',
  },
  {
    key: 'swift_archer',
    name: 'Pemanah Cekatan',
    emoji: '🏹',
    description: 'Disiplin dan selalu tepat waktu menyelesaikan tugas.',
    bgColor: 'from-emerald-400 to-teal-600',
  },
  {
    key: 'space_cadet',
    name: 'Penjelajah Antariksa',
    emoji: '🚀',
    description: 'Penuh rasa ingin tahu dan suka eksplorasi.',
    bgColor: 'from-blue-400 to-cyan-600',
  },
];

export const QUEST_CATEGORY_META: Record<
  QuestCategory,
  { label: string; icon: string; color: string }
> = {
  MORNING_ROUTINE: { label: 'Rutinitas Pagi', icon: '☀️', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  STUDY: { label: 'Belajar & Tugas', icon: '📚', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  CHORES: { label: 'Bantu Rumah', icon: '🧹', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  FITNESS: { label: 'Olahraga & Sehat', icon: '🏃', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  KINDNESS: { label: 'Kebaikan & Kasih', icon: '❤️', color: 'bg-pink-100 text-pink-800 border-pink-300' },
  HEALTH: { label: 'Kebersihan Diri', icon: '🦷', color: 'bg-teal-100 text-teal-800 border-teal-300' },
};
