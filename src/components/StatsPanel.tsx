import React from 'react';
import { useAppStore } from '../store';
import type { StatKey } from '../store/types';

const STAT_NAMES: Record<StatKey, string> = {
  STR: 'Сила',
  INT: 'Интеллект',
  WIS: 'Мудрость',
  CHA: 'Харизма',
  AGI: 'Ловкость',
  END: '⚠️ (устаревшая)', // больше не используется
};

export default function StatsPanel() {
  const stats = useAppStore((s) => s.stats);
  const freePoints = useAppStore((s) => s.freePoints);
  const increaseStat = useAppStore((s) => s.increaseStat);

  // === Основной уровень игрока ===
  const level = useAppStore((s) => s.level);
  const exp = useAppStore((s) => s.exp);
  const requiredExp = useAppStore((s) => s.requiredExp);
  const expPercent = Math.min((exp / requiredExp) * 100, 100);

  // === Автоматические параметры ===
  const willpower = useAppStore((s) => s.willpower);
  const physicalEndurance = useAppStore((s) => s.physicalEndurance);
  const mentalEndurance = useAppStore((s) => s.mentalEndurance);

  return (
    <div className="p-4 space-y-6">
      {/* === Общий уровень персонажа === */}
      <div className="bg-gray-900 p-4 rounded-xl shadow">
        <h3 className="text-indigo-400 text-lg font-semibold mb-2 flex items-center gap-2">
          🌟 Уровень персонажа
        </h3>

        <div className="flex justify-between mb-1">
          <span className="text-gray-200 font-semibold">Lv.{level}</span>
          <span className="text-gray-400 text-sm">
            {Math.floor(exp)}/{requiredExp} XP
          </span>
        </div>

        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"
            style={{ width: `${expPercent}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Прогресс уровня: {expPercent.toFixed(1)}%
        </div>
      </div>

      {/* === Основные характеристики === */}
      <div className="bg-gray-900 p-4 rounded-xl shadow">
        <div className="flex justify-between mb-3">
          <span className="font-semibold text-lg text-gray-200">
            Основные характеристики
          </span>
          <span className="text-indigo-400 font-bold">
            Свободные очки: {freePoints}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(stats)
            .filter(([key]) => key !== 'END')
            .map(([key, st]) => {
              const percent = Math.min((st.xp / st.required) * 100, 100);
              return (
                <div
                  key={key}
                  className="bg-gray-800 rounded-lg p-3 flex flex-col justify-between shadow"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-100">
                      {STAT_NAMES[key as StatKey] || key}
                    </span>
                    <span className="text-gray-400">Lv.{st.level}</span>
                  </div>

                  <div className="w-full bg-gray-700 h-2 rounded">
                    <div
                      className="h-2 bg-indigo-500 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {Math.round(st.xp)}/{st.required} XP
                  </div>

                  <button
                    disabled={freePoints <= 0}
                    onClick={() => increaseStat(key as StatKey)}
                    className={`mt-2 py-1 rounded text-sm font-semibold transition ${
                      freePoints > 0
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Повысить
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* === Автоматические характеристики === */}
      <div className="bg-gray-900 p-4 rounded-xl shadow">
        <h3 className="text-indigo-400 text-lg font-semibold mb-4">
          Параметры выносливости и воли
        </h3>

        <AutoStat
          label="🧠 Сила воли"
          param={willpower}
          color="from-indigo-500 to-purple-500"
        />
        <AutoStat
          label="💪 Физическая выносливость"
          param={physicalEndurance}
          color="from-blue-500 to-cyan-400"
        />
        <AutoStat
          label="🧘‍♂️ Ментальная выносливость"
          param={mentalEndurance}
          color="from-emerald-500 to-green-400"
        />
      </div>
    </div>
  );
}

// === Компонент отображения прогресса автохарактеристик ===
function AutoStat({
  label,
  param,
  color,
}: {
  label: string;
  param: { level: number; progress: number; required: number };
  color: string;
}) {
  const percent = Math.min((param.progress / param.required) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-100 font-semibold">{label}</span>
        <span className="text-gray-400">Lv.{param.level}</span>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded">
        <div
          className={`h-2 bg-gradient-to-r ${color} rounded`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs text-gray-400 mt-1">
        Прогресс: {param.progress.toFixed(1)}/{param.required} XP
      </div>
    </div>
  );
}
