// === Типы данных для Solo Leveling System (расширенная система опыта) ===

// ===== Характеристики (базовые параметры) =====
export type StatKey = 'STR' | 'INT' | 'WIS' | 'CHA' | 'AGI' | 'END';

// ====== Состояние характеристик ======
export interface Stat {
  level: number;     // текущий уровень характеристики
  xp: number;        // "внутренний XP" внутри уровня
  required: number;  // сколько XP нужно до следующего уровня
}

// ====== Навыки ======
export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  required: number;
  affinityStats: Record<StatKey, number>; // какие статы развивает (пример: { INT: 0.6, WIS: 0.4 })
}

// ====== Параметры силы воли / выносливости ======
export interface AutoParam {
  level: number;
  progress: number;
}

// ====== Сессии фокуса ======
export interface Session {
  id: string;
  start: number;
  end: number;
  minutes: number;
  activityType: string;
  skillId?: string;
  expGranted: number;
}

// ====== Квесты ======
export type QuestType = 'daily' | 'weekly' | 'story' | 'reactive';
export type QuestStatus = 'open' | 'done' | 'failed';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  skillId?: string;
  plannedMinutes?: number;
  createdAt: number;
  deadline?: number;
  status: QuestStatus;
  completedAt?: number;
}

// ====== Достижения ======
export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  hidden: boolean;
  progress: number;
  achievedAt?: number;
}

// ====== Инвентарь ======
export type ItemType = 'artifact' | 'cosmetic' | 'tool' | 'note';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  tags: string[];
  pinned: boolean;
  equipped: boolean;
}

// ====== Психофизическое состояние ======
export type Mood = 'neutral' | 'focused' | 'tired' | 'motivated' | 'low';

export interface MindBodyDay {
  date: string;
  mood: Mood;
  fatigue: number; // 0–100
  wellbeing: number; // 0–100
  motivation: number; // 0–10
  focusScore: number;
}

// ====== Состояние пользователя ======
export interface UserState {
  level: number;
  exp: number;
  requiredExp: number;

  // Свободные очки для ручного распределения
  freePoints: number;

  // Характеристики (каждая характеристика хранит свой XP)
  stats: Record<StatKey, Stat>;

  // Навыки
  skills: Skill[];

  // Автоматические параметры
  willpower: AutoParam;
  endurance: AutoParam;

  // Прочие параметры
  streak: number;
  bestStreak: number;
  activeTitleId?: string;
}
