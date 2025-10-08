import React, { useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { useAppStore } from '../store';
import { calculateSessionExp } from '../utils/formulas';

// Функция форматирования времени (часы:минуты:секунды)
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function FocusPanel() {
  const {
    isFocusRunning,
    focusSeconds,
    focusActivity,
    focusSkillId,
    startFocus,
    pauseFocus,
    stopFocus,
    setFocusActivity,
    setFocusSkill,
    skills,
  } = useAppStore();

  const activityOptions = [
    { id: 'study', label: 'Учёба / чтение', weight: 1.0 },
    { id: 'practice', label: 'Практика / CTF', weight: 1.2 },
    { id: 'review', label: 'Повторение / конспекты', weight: 0.8 },
  ];

  // Обновляем таймер каждую секунду
  useEffect(() => {
    if (!isFocusRunning) return;
    const interval = setInterval(() => {
      useAppStore.getState().tickFocus(); // обновляем из стора
    }, 1000);
    return () => clearInterval(interval);
  }, [isFocusRunning]);

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
        <Clock size={20} /> Фокус-сессия
      </h2>

      {/* Выбор активности */}
      <div className="flex flex-col gap-3 mb-6">
        <label className="text-sm text-gray-400">Тип активности:</label>
        <select
          value={focusActivity}
          onChange={(e) => setFocusActivity(e.target.value)}
          className="bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm"
        >
          {activityOptions.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>

        <label className="text-sm text-gray-400">Навык:</label>
        <select
          value={focusSkillId ?? ''}
          onChange={(e) => setFocusSkill(e.target.value || null)}
          className="bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm"
        >
          <option value="">Без навыка</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Таймер */}
      <div className="text-center text-5xl font-mono mb-6 text-indigo-400">
        {formatTime(focusSeconds)}
      </div>

      {/* Кнопки управления */}
      <div className="flex justify-center gap-4">
        {!isFocusRunning ? (
          <button
            onClick={startFocus}
            className="px-5 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <Play size={18} /> Старт
          </button>
        ) : (
          <button
            onClick={pauseFocus}
            className="px-5 py-2 bg-yellow-600 rounded-md hover:bg-yellow-700 flex items-center gap-2"
          >
            <Pause size={18} /> Пауза
          </button>
        )}

        <button
          onClick={stopFocus}
          className="px-5 py-2 bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2"
        >
          <Square size={18} /> Стоп
        </button>
      </div>
    </div>
  );
}
