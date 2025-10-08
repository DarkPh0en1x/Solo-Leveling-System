import React, { useEffect, useState } from 'react';
import { ScrollText, Filter } from 'lucide-react';
import { getLogs, LogEntry } from '../utils/idb';

export default function JournalPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('ALL');

  // Загружаем события при открытии
  useEffect(() => {
    const load = async () => {
      const data = await getLogs();
      setLogs(data);
    };
    load();

    // Автообновление каждые 10 секунд
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs =
    filter === 'ALL' ? logs : logs.filter((l) => l.type === filter);

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-indigo-300 flex items-center gap-2">
          <ScrollText size={20} /> Журнал событий
        </h2>

        {/* Фильтр по типу */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Filter size={16} className="text-indigo-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#0f0f10] border border-indigo-700 rounded px-2 py-1 text-sm"
          >
            <option value="ALL">Все</option>
            <option value="LEVEL_UP">Уровни</option>
            <option value="SKILL_UP">Навыки</option>
            <option value="STAT_UP">Характеристики</option>
            <option value="WILLPOWER">Сила воли</option>
            <option value="ENDURANCE">Выносливость</option>
            <option value="EXP">Опыт</option>
            <option value="QUEST">Квесты</option>
          </select>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <p className="text-gray-400 italic text-sm">Записей пока нет...</p>
      )}

      <div className="flex flex-col gap-3 mt-3">
        {filteredLogs.map((entry) => (
          <div
            key={entry.id}
            className="bg-[#0f0f10] border border-indigo-800 rounded-md p-3 text-sm"
          >
            <p className="text-gray-400 text-xs">
              {new Date(entry.timestamp).toLocaleString()}
            </p>
            <p className="text-indigo-300 font-medium">{entry.title}</p>
            {entry.message && (
              <p className="text-gray-400">{entry.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

