// === Формулы и вычисления Solo Leveling System (линейная версия) ===

// ====== БАЗОВЫЕ НАСТРОЙКИ ======
export const BASE_EXP_PLAYER = 100;      // стартовый порог XP для персонажа
export const BASE_EXP_SKILL = 100;       // стартовый порог XP для навыков
export const BASE_EXP_STAT = 100;        // стартовый порог XP для статов
export const BASE_EXP_WILLPOWER = 100;   // стартовый порог XP для силы воли и выносливости

export const GROWTH_PLAYER = 100;        // рост порога XP за уровень у персонажа (+100)
export const GROWTH_SKILL = 50;          // рост порога XP за уровень у навыков (+50)
export const GROWTH_STAT = 50;           // рост порога XP за уровень у статов (+50)
export const GROWTH_WILLPOWER = 50;      // рост порога XP за уровень у воли/выносливости (+50)

// ====== ВСПОМОГАТЕЛЬНЫЕ ======
export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function round(n: number): number {
  return Math.round(n);
}

// ====== EXP персонажа ======
export function calculateSessionExp(minutes: number, weight: number): number {
  return minutes * weight; // базовый множитель
}

export function calculateRequiredExp(level: number): number {
  return BASE_EXP_PLAYER + (level - 1) * GROWTH_PLAYER;
}

// ====== Навыки ======
export function calculateSkillRequired(level: number): number {
  return BASE_EXP_SKILL + (level - 1) * GROWTH_SKILL;
}

// ====== Характеристики (статы) ======
export function calculateStatRequired(level: number): number {
  return BASE_EXP_STAT + (level - 1) * GROWTH_STAT;
}

// ====== Willpower / Endurance ======
export function calculateWillpowerRequired(level: number): number {
  return BASE_EXP_WILLPOWER + (level - 1) * GROWTH_WILLPOWER;
}

// ====== Преобразование опыта навыка в опыт статов ======
export const STAT_DIVIDER = 100; // чем выше — тем медленнее рост

export function convertSkillXpToStatXp(skillXp: number, affinityWeight: number): number {
  return (skillXp * clamp01(affinityWeight)) / STAT_DIVIDER;
}

// ====== Штрафы ======
export function calculatePenalty(todayExp: number): number {
  return Math.round(todayExp * 0.1);
}

// ====== Универсальная формула динамического порога ======
export function calculateDynamicRequiredExp(level: number, base = 100, growth = 50): number {
  return base + (level - 1) * growth;
}
