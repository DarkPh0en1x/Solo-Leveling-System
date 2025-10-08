import Dexie, { Table } from 'dexie';
import toast from 'react-hot-toast';

// ===== Интерфейсы для таблиц =====

// Сессии фокуса
export interface FocusSession {
  id?: number;
  start: number;
  end: number;
  minutes: number;
  activityType: string;
  skillId?: string;
  expGranted: number;
}

// Логи событий (новая таблица)
export interface LogEntry {
  id?: number;
  type: 'EXP' | 'LEVEL_UP' | 'SKILL_UP' | 'STAT_UP' | 'WILLPOWER' | 'ENDURANCE' | 'QUEST';
  title: string;
  message: string;
  timestamp: number;
}

// ===== База данных =====
export class SoloLevelingDB extends Dexie {
  sessions!: Table<FocusSession, number>;
  logs!: Table<LogEntry, number>; // 🆕 новая таблица

  constructor() {
    super('SoloLevelingDB');

    this.version(1).stores({
      sessions: '++id, start, end',
      logs: '++id, type, timestamp', // добавили журнал
    });
  }
}

// ===== Экземпляр базы =====
export const db = new SoloLevelingDB();

// ===== Утилиты для записи =====

// Добавить новую фокус-сессию
export async function saveSession(session: FocusSession) {
  try {
    await db.sessions.add(session);
  } catch (err) {
    console.error('Ошибка при сохранении сессии:', err);
  }
}

// 🆕 Добавить запись в журнал
export async function logEvent(entry: Omit<LogEntry, 'timestamp'>) {
  try {
    const data = { ...entry, timestamp: Date.now() };
    await db.logs.add(data);

    // 🟣 Показ уведомления
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } bg-[#0f0f10] border border-indigo-700/60 text-gray-200 px-4 py-2 rounded-lg shadow-md`}
      >
        <p className="font-semibold text-indigo-400">{entry.title}</p>
        {entry.message && <p className="text-gray-400 text-sm">{entry.message}</p>}
      </div>
    ));
  } catch (err) {
    console.error('Ошибка при записи события в журнал:', err);
  }
}

// Получить все записи журнала (по убыванию времени)
export async function getLogs(): Promise<LogEntry[]> {
  return db.logs.orderBy('timestamp').reverse().toArray();
}
