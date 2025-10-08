import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  calculateSkillRequired, 
  calculateStatRequired, 
  calculateRequiredExp, 
  calculateSessionExp 
} from '../utils/formulas';

// === Типы данных для Solo Leveling System (расширенная система опыта) ===

// ===== Характеристики (базовые параметры) =====
export type StatKey = 'STR' | 'INT' | 'WIS' | 'CHA' | 'AGI';

// ====== Состояние характеристик ======
export interface Stat {
  level: number;
  xp: number;
  required: number;
}

// ====== Навыки ======
export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  required: number;
  affinityStats: Record<StatKey, number>; // какие статы развивает
  enduranceType: 'mental' | 'physical'; // 🆕 тип нагрузки навыка (ментальная или физическая)
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

  // 💰 Вознаграждение (в деньгах)
  reward?: number;
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

// ====== Магазин ======
export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  tags?: string[];
  active: boolean;
}

export interface Purchase {
  id: string;
  itemId: string;
  nameSnapshot: string;
  price: number;
  purchasedAt: number;
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
  fatigue: number;
  wellbeing: number;
  motivation: number;
  focusScore: number;
}

// ====== Состояние пользователя ======
export interface UserState {
  level: number;
  exp: number;
  requiredExp: number;
  freePoints: number;
  stats: Record<StatKey, Stat>;
  skills: Skill[];

  // Психофизические параметры
  willpower: AutoParam;
  mentalEndurance: AutoParam;
  physicalEndurance: AutoParam;

  streak: number;
  bestStreak: number;
  activeTitleId?: string;
  // 💰 Баланс игрока
  money: number;
  // 🛒 Магазин
  shopItems: ShopItem[];
  purchases: Purchase[];
}

// =============================
// === Zustand store начало ===
// =============================

export const useAppStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 🧩 Начальные значения
      level: 1,
      exp: 0,
      requiredExp: 100,
      freePoints: 0,

      stats: {
  STR: { level: 1, xp: 0, required: 100 },
  INT: { level: 1, xp: 0, required: 100 },
  WIS: { level: 1, xp: 0, required: 100 },
  CHA: { level: 1, xp: 0, required: 100 },
  AGI: { level: 1, xp: 0, required: 100 },
},

skills: [],
// 🧠 Автоматические параметры
willpower: { level: 1, progress: 0, required: 100 },
mentalEndurance: { level: 1, progress: 0, required: 100 },
physicalEndurance: { level: 1, progress: 0, required: 100 },
      streak: 0,
      bestStreak: 0,

      // ⚙️ Добавить опыт персонажу
      addExp(expGain: number) {
        const { exp, level, requiredExp } = get();
        let totalExp = exp + expGain;
        let newLevel = level;
        let newRequired = requiredExp;

        // Проверяем ап уровня
        while (totalExp >= newRequired) {
  totalExp -= newRequired;
  newLevel++;

  // динамически увеличиваем порог: +100 XP за каждый уровень
  newRequired = 100 + (newLevel - 1) * 100;

  get().addFreePoints(5);
  console.log(`LEVEL UP → ${newLevel}, Next required XP: ${newRequired}`);
}

        set({ exp: totalExp, level: newLevel, requiredExp: newRequired });
		get().recordDailyProgress(); // 🧩 фиксируем прогресс за день
      },

      // ⚙️ Начислить опыт за квест
      addQuestExp(skillId: string | null, minutes: number, weight: number) {
        const exp = Math.round(minutes * weight);
        get().addExp(exp);
        if (skillId) get().grantSkillXp(skillId, exp);
        console.log(`Quest Completed → +${exp} EXP`);
      },

// === Конец ЧАСТИ 1 ===
      // ⚙️ Начисление XP навыку + связанным характеристикам
grantSkillXp(skillId: string, gainedXp: number) {
  const {
    skills,
    stats,
    addExp,
  } = get();

  const skill = skills.find((s) => s.id === skillId);
  if (!skill) return;

  let xp = skill.xp + gainedXp;
  let level = skill.level;
  let required = skill.required;

  // Повышение уровня навыка
  while (xp >= required) {
  xp -= required;
  level++;

  // динамически увеличиваем порог: +50 XP за каждый уровень
  required = 100 + (level - 1) * 50;

  console.log(`SKILL LEVEL UP → ${skill.name} → ${level}, Next required XP: ${required}`);
  }

  // 💡 Прокачка характеристик по времени
  const newStats = { ...stats };
  const minutes = Math.max(gainedXp / 1.0, 1); // количество минут (примерная оценка)
  Object.entries(skill.affinityStats || {}).forEach(([statKey, weight]) => {
    if (weight > 0) {
      const gain = minutes * 0.5 * weight; // 0.5 XP в минуту с учётом веса
      const st = newStats[statKey as keyof typeof stats];
      if (st) {
        let statXp = st.xp + gain;
        let statLvl = st.level;
        let statReq = st.required;
        while (statXp >= statReq) {
          statXp -= statReq;
          statLvl++;
          statReq = calculateStatRequired(statLvl);
          console.log(`STAT LEVEL UP → ${statKey} (${statLvl})`);
        }
        newStats[statKey as keyof typeof stats] = {
          ...st,
          xp: statXp,
          level: statLvl,
          required: statReq,
        };
      }
    }
  });
  set({ stats: newStats });

  // 📈 Часть опыта навыка идёт в общий уровень
  addExp(gainedXp * 0.3);

  // ✅ Обновляем сам навык
  const updatedSkills = skills.map((s) =>
    s.id === skillId ? { ...s, xp, level, required } : s
  );
  set({ skills: updatedSkills });
},



      // ⚙️ Начисление полного опыта (например, из фокус-сессии)
      grantFullExp(skillId: string | null, minutes: number, weight: number) {
        const exp = Math.round(minutes * weight);
        get().addExp(exp);
        if (skillId) get().grantSkillXp(skillId, exp);
        console.log(`EXP +${exp} (${skillId ?? 'общий'})`);
      },

      // 🧩 Добавить новый навык вручную
      addSkill(newSkill: Skill) {
        const { skills } = get();

        if (skills.find((s) => s.id === newSkill.id)) {
          alert('Навык с таким ID уже существует.');
          return;
        }

        const updated = [...skills, newSkill];
        set({ skills: updated });
        console.log(`Skill Created → ${newSkill.name}`);
      },

      // 🧩 Добавить свободное очко вручную (например после апа уровня)
      addFreePoints(amount: number) {
        const { freePoints } = get();
        set({ freePoints: freePoints + amount });
      },

      // 🧩 Потратить одно очко на характеристику вручную
      increaseStat(statKey: StatKey) {
        const { stats, freePoints } = get();
        if (freePoints <= 0) return;

        const st = stats[statKey];
        if (!st) return;

        const newStats = { ...stats };
        newStats[statKey] = {
          level: st.level + 1,
          xp: 0,
          required: calculateStatRequired(st.level + 1),
        };

        set({
          stats: newStats,
          freePoints: freePoints - 1,
        });

        console.log(`MANUAL STAT UP → ${statKey} (${newStats[statKey].level})`);
      },

      // ⚙️ Сброс ежедневных параметров (Willpower/Endurance)
      resetDailyStats() {
        const { endurance, willpower } = get();
        set({
          endurance: { ...endurance, progress: 0 },
          willpower: { ...willpower, progress: 0 },
        });
        console.log('Daily stats reset.');
      },

      // 🧘‍♂️ Обновить ментальную выносливость
addMentalEndurance(minutes: number) {
  const { mentalEndurance } = get();
  const gain = minutes * 0.5; // 0.5 XP за минуту
  let { level, progress, required } = mentalEndurance;

  progress += gain;

  while (progress >= required) {
    progress -= required;
    level++;
    required = 100 + (level - 1) * 50; // растёт на +50 XP за уровень
  }

  set({ mentalEndurance: { level, progress, required } });

  if (gain > 0) {
    console.log(`🧘‍♂️ MENTAL ENDURANCE +${gain.toFixed(1)} XP → Lv.${level} (${progress.toFixed(1)}/${required})`);
  }

  get().recordDailyProgress();
},




// 💪 Обновить физическую выносливость
addPhysicalEndurance(minutes: number) {
  const { physicalEndurance } = get();
  const gain = minutes * 0.5; // 0.5 XP за минуту
  let { level, progress, required } = physicalEndurance;

  progress += gain;

  while (progress >= required) {
    progress -= required;
    level++;
    required = 100 + (level - 1) * 50;
  }

  set({ physicalEndurance: { level, progress, required } });

  if (gain > 0) {
    console.log(`💪 PHYSICAL ENDURANCE +${gain.toFixed(1)} XP → Lv.${level} (${progress.toFixed(1)}/${required})`);
  }

  get().recordDailyProgress();
},




// 🔥 Обновить силу воли
addWillpower(minutes: number) {
  const { willpower } = get();
  const gain = minutes * 0.5; // 0.5 XP за минуту
  let { level, progress, required } = willpower;

  progress += gain;

  while (progress >= required) {
    progress -= required;
    level++;
    required = 100 + (level - 1) * 50;
  }

  set({ willpower: { level, progress, required } });

  if (gain > 0) {
    console.log(`🔥 WILLPOWER +${gain.toFixed(1)} XP → Lv.${level} (${progress.toFixed(1)}/${required})`);
  }

  if (typeof get().recordDailyProgress === 'function') {
    get().recordDailyProgress();
  }
},


// === Конец ЧАСТИ 2 ===
      // 🧾 Получить суммарный прогресс статов (для аналитики, графиков)
      getTotalStats() {
        const { stats } = get();
        return Object.entries(stats).reduce(
          (acc, [key, st]) => ({ ...acc, [key]: st.level }),
          {}
        );
      },

      // 📊 Получить общий уровень навыков (для статистики)
      getTotalSkillLevels() {
        const { skills } = get();
        return skills.reduce((acc, s) => acc + s.level, 0);
      },

      // 📈 Общий EXP из всех навыков (для графика прогресса)
      getTotalSkillExp() {
        const { skills } = get();
        return skills.reduce((acc, s) => acc + s.xp, 0);
      },
	  
	  
	  achievements: [], // 🏆 чтобы не было undefined

addAchievement(newAchievement: Achievement) {
  const { achievements } = get();
  set({ achievements: [...achievements, newAchievement] });
  console.log(`Achievement added → ${newAchievement.title}`);
},

completeAchievement(id: string) {
  const { achievements } = get();
  const updated = achievements.map((a) =>
    a.id === id ? { ...a, progress: 100, achievedAt: Date.now() } : a
  );
  set({ achievements: updated });
  console.log(`Achievement completed → ${id}`);
},
	  
	  quests: [], // 🟢 чтобы не было undefined

addQuest(newQuest: Quest) {
  const { quests } = get();
  set({ quests: [...quests, newQuest] });
  console.log(`Quest Created → ${newQuest.title}`);
},

// 💰 Баланс игрока
money: 0,

// 💸 Добавить деньги
addMoney(amount: number) {
  const { money } = get();
  const safeAmount = isNaN(amount) ? 0 : amount;
  const safeMoney = isNaN(money) ? 0 : money;
  set({ money: safeMoney + safeAmount });
  console.log(`Money +${safeAmount} → ${safeMoney + safeAmount}`);
  get().recordDailyProgress(); // 🧩 фиксируем прогресс за день
},

// 💸 Потратить деньги
spendMoney(amount: number) {
  const { money } = get();
  const safeMoney = isNaN(money) ? 0 : money;
  const safeAmount = isNaN(amount) ? 0 : amount;

  if (safeMoney < safeAmount) {
    alert('Недостаточно средств!');
    return;
  }

  set({ money: safeMoney - safeAmount });
  console.log(`Money -${safeAmount} → ${safeMoney - safeAmount}`);
  get().recordDailyProgress(); // 🧩 фиксируем прогресс за день
},

// ✅ Обновляем квест с начислением денег
completeQuest(id: string) {
  const { quests, addMoney } = get();
  const updated = quests.map((q) => {
    if (q.id === id && q.status !== 'done') {
      if (q.reward) addMoney(q.reward); // начисляем деньги за квест
      return { ...q, status: 'done', completedAt: Date.now() };
    }
    return q;
  });
  set({ quests: updated });
  console.log(`Quest Completed → ${id}`);
},



// === 🛒 Магазин ===

// 📦 Начальные массивы
shopItems: [],
purchases: [],

// ➕ Добавить товар
addShopItem(item: ShopItem) {
  const { shopItems } = get();
  if (shopItems.find((i) => i.id === item.id)) {
    alert('Товар с таким ID уже существует.');
    return;
  }
  set({ shopItems: [...shopItems, item] });
  console.log(`Shop Item Added → ${item.name}`);
},

// ✏️ Обновить товар
updateShopItem(id: string, patch: Partial<ShopItem>) {
  const { shopItems } = get();
  const updated = shopItems.map((i) => (i.id === id ? { ...i, ...patch } : i));
  set({ shopItems: updated });
  console.log(`Shop Item Updated → ${id}`);
},

// ❌ Удалить товар
deleteShopItem(id: string) {
  const { shopItems } = get();
  set({ shopItems: shopItems.filter((i) => i.id !== id) });
  console.log(`Shop Item Deleted → ${id}`);
},

// 💸 Купить товар
buyItem(itemId: string) {
  const { shopItems, money, spendMoney } = get();
  const item = shopItems.find((i) => i.id === itemId && i.active);
  if (!item) {
    alert('Товар недоступен.');
    return;
  }
  if (money < item.price) {
    alert('Недостаточно средств!');
    return;
  }

  spendMoney(item.price);
  const purchase: Purchase = {
    id: Date.now().toString(),
    itemId: item.id,
    nameSnapshot: item.name,
    price: item.price,
    purchasedAt: Date.now(),
  };

  set({ purchases: [...get().purchases, purchase] });
  console.log(`Item Purchased → ${item.name} за ${item.price}`);
},

// === 🧠 Сессии фокуса ===
sessions: [],

addSession(newSession: Session) {
  const { sessions } = get();
  set({ sessions: [...sessions, newSession] });
  console.log(`🧩 Focus session recorded → ${newSession.minutes} мин (${newSession.activityType})`);
},


// === ⏱️ Фокус-сессия ===
isFocusRunning: false,
focusSeconds: 0,
focusActivity: 'study',
focusSkillId: null,

startFocus() {
  set({ isFocusRunning: true });
},

pauseFocus() {
  set({ isFocusRunning: false });
},

stopFocus() {
  const state = get();
  const {
    focusSeconds,
    focusActivity,
    focusSkillId,
    addSession,
    addExp,
    grantSkillXp,
    addWillpower,
    addMentalEndurance,
    addPhysicalEndurance,
  } = state;

  if (focusSeconds <= 0) {
    set({ isFocusRunning: false, focusSeconds: 0 });
    return;
  }

  const minutes = Math.floor(focusSeconds / 60);
  const weight =
    focusActivity === 'practice' ? 1.2 :
    focusActivity === 'review' ? 0.8 : 1.0;

  const exp = calculateSessionExp(minutes, weight);

  // Добавляем сессию
  addSession({
    id: Date.now().toString(),
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    minutes,
    activityType: focusActivity,
    skillId: focusSkillId ?? undefined,
    expGranted: exp,
  });

  // Общий опыт
  addExp(exp);

  // Навык + статы
  if (focusSkillId && typeof grantSkillXp === 'function') {
    grantSkillXp(focusSkillId, exp);
    const skill = get().skills.find((s) => s.id === focusSkillId);
    if (skill) {
      if (skill.enduranceType === 'mental') addMentalEndurance(minutes);
      else addPhysicalEndurance(minutes);
    }
  }

  // Всегда растёт сила воли
  addWillpower(minutes);

  set({ isFocusRunning: false, focusSeconds: 0 });
  console.log(`🎯 Focus stopped → +${exp} EXP (${minutes} мин)`);
},


tickFocus() {
  const { isFocusRunning, focusSeconds } = get();
  if (isFocusRunning) set({ focusSeconds: focusSeconds + 1 });
},

setFocusActivity(activity: string) {
  set({ focusActivity: activity });
},

setFocusSkill(id: string | null) {
  set({ focusSkillId: id });
},





// ====== Инвентарь и титулы ======
inventory: [],
titles: [],
activeTitleId: undefined,

addItem(newItem: Item) {
  const { inventory } = get();
  set({ inventory: [...inventory, newItem] });
  console.log(`Item added → ${newItem.name}`);
},

addTitle(newTitle: { id: string; name: string; description: string }) {
  const { titles } = get();
  set({ titles: [...titles, newTitle] });
  console.log(`Title added → ${newTitle.name}`);
},

setActiveTitle(id: string) {
  set({ activeTitleId: id });
  console.log(`Active title set → ${id}`);
},

mindBodyDays: [], // 🧘‍♂️ чтобы не было undefined

addMindBodyEntry(newEntry: MindBodyDay) {
  const { mindBodyDays } = get();
  set({ mindBodyDays: [...mindBodyDays, newEntry] });
  console.log(`MindBody entry added → ${newEntry.date}`);
},

updateMindBodyEntry(date: string, data: Partial<MindBodyDay>) {
  const { mindBodyDays } = get();
  const updated = mindBodyDays.map((d) =>
    d.date === date ? { ...d, ...data } : d
  );
  set({ mindBodyDays: updated });
  console.log(`MindBody entry updated → ${date}`);
},

// ⚙️ Конфигурация приложения (для вкладки "Настройки")
config: {
  studyWeight: 1.0,
  practiceWeight: 1.0,
  reviewWeight: 1.0,
  expLevelPower: 1.2,
},

setConfig(newConfig: {
  studyWeight?: number;
  practiceWeight?: number;
  reviewWeight?: number;
  expLevelPower?: number;
}) {
  set({ config: { ...get().config, ...newConfig } });
  console.log('Config updated:', newConfig);
},

// 📤 Экспорт всех данных приложения
exportData() {
  try {
    const data = get();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `solo-leveling-data-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('Data exported.');
  } catch (err) {
    console.error('Export error:', err);
  }
},

// 📥 Импорт данных из JSON
importData(data: Partial<UserState>) {
  try {
    // Слияние с текущим состоянием (только допустимые поля)
    set({
      ...get(),
      ...data,
      config: { ...get().config, ...(data as any).config },
    });
    console.log('Data imported.');
  } catch (err) {
    console.error('Import error:', err);
  }
},

      // 📆 Обновление стриков
      updateStreak(success: boolean) {
        const { streak, bestStreak } = get();
        const newStreak = success ? streak + 1 : 0;
        const newBest = success && newStreak > bestStreak ? newStreak : bestStreak;
        set({ streak: newStreak, bestStreak: newBest });
        console.log(`Streak updated → ${newStreak} (Best: ${newBest})`);
      },
	  // === 📜 История прогресса (для графиков) ===
progressHistory: [],

// 📌 Сохранить состояние за текущий день
recordDailyProgress() {
  const {
    progressHistory,
    exp,
    money,
    willpower,
    mentalEndurance,
    physicalEndurance,
  } = get();

  const today = new Date().toISOString().slice(0, 10);
  const existing = progressHistory.find((p) => p.date === today);

  const newEntry = {
    date: today,
    exp,
    money,
    willpower: willpower.level,
    mentalEndurance: mentalEndurance.level,
    physicalEndurance: physicalEndurance.level,
  };

  if (existing) {
    const updated = progressHistory.map((p) =>
      p.date === today ? newEntry : p
    );
    set({ progressHistory: updated });
  } else {
    set({ progressHistory: [...progressHistory, newEntry] });
  }

  console.log('📊 Daily progress recorded:', newEntry);
},
	  
    }),
	
    {
  name: 'solo-leveling-store', // тот же ключ
  version: 3,
  migrate: (state: any, version) => {
    // Если ранее поле называлось mindBody (или отсутствовало) — переносим
    if (version < 2 && state) {
      if (state.mindBody) {
        return {
          ...state,
          mindBodyDays: state.mindBody,
        };
      }
    }

    // 🆕 Перенос endurance → physicalEndurance
    if (version < 3 && state && state.endurance) {
      return {
        ...state,
        physicalEndurance: state.endurance,
        endurance: undefined,
      };
    }

    return state as any;
  }, // ← обязательно закрываем migrate!
  partialize: (state) => ({
    level: state.level,
    exp: state.exp,
    requiredExp: state.requiredExp,
    freePoints: state.freePoints,
    stats: state.stats,
    skills: state.skills,
    willpower: state.willpower,
mentalEndurance: state.mentalEndurance,
physicalEndurance: state.physicalEndurance,
    streak: state.streak,
    bestStreak: state.bestStreak,
    activeTitleId: state.activeTitleId,
    quests: state.quests,
    achievements: state.achievements,
    inventory: state.inventory,
    titles: state.titles,
    config: state.config,
    // 👇 ОБЯЗАТЕЛЬНО — теперь сохраняем дневник состояний
    mindBodyDays: state.mindBodyDays,
	money: state.money,
	shopItems: state.shopItems,
	purchases: state.purchases,
	progressHistory: state.progressHistory,
  }),
}
  )
);
