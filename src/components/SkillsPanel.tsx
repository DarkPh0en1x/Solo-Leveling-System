import React, { useState } from 'react';
import { useAppStore } from '../store';
import { calculateSkillRequired } from '../utils/formulas';
import type { Skill, StatKey } from '../store/types';

// Все характеристики для выбора при создании навыка
const STAT_KEYS: StatKey[] = ['STR', 'INT', 'WIS', 'CHA', 'AGI']; // Убрали END

export default function SkillsPanel() {
  const { skills, stats } = useAppStore();
  const addSkill = useAppStore((s: any) => s.addSkill);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [enduranceType, setEnduranceType] = useState<'mental' | 'physical'>('mental'); // 🧠 новый параметр
  const [affinity, setAffinity] = useState<Record<StatKey, number>>({
    STR: 0,
    INT: 0,
    WIS: 0,
    CHA: 0,
    AGI: 0,
  });

  // обновление веса аффинити
  const handleAffinityChange = (key: StatKey, value: number) => {
    const v = Math.max(0, Math.min(1, value));
    setAffinity((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert('Введите название навыка');
    const total = Object.values(affinity).reduce((a, b) => a + b, 0);
    if (total === 0) return alert('Выберите хотя бы одну характеристику');

    addSkill({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      level: 1,
      xp: 0,
      required: calculateSkillRequired(1),
      affinityStats: affinity,
      enduranceType, // 💪 добавили тип выносливости
    });

    setName('');
    setAffinity({ STR: 0, INT: 0, WIS: 0, CHA: 0, AGI: 0 });
    setEnduranceType('mental');
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Навыки</h2>

      {/* Список навыков */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skills.map((s: Skill) => (
          <div key={s.id} className="bg-gray-800 p-3 rounded-xl shadow">
            <div className="flex justify-between">
              <span className="font-semibold">{s.name}</span>
              <span>Lv.{s.level}</span>
            </div>

            <div className="w-full bg-gray-700 h-2 mt-2 rounded">
              <div
                className="h-2 bg-indigo-500 rounded"
                style={{ width: `${(s.xp / s.required) * 100}%` }}
              />
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {Math.round(s.xp)}/{s.required} XP
            </div>

            <div className="text-xs mt-1 text-gray-300">
              Развивает:{' '}
              {Object.entries(s.affinityStats)
                .filter(([_, v]) => v > 0)
                .map(([k, v]) => `${k} (${(v * 100).toFixed(0)}%)`)
                .join(', ') || '—'}
            </div>

            <div className="text-xs text-gray-400 mt-1 italic">
              Нагрузка: {s.enduranceType === 'mental' ? '🧠 Ментальная' : '💪 Физическая'}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка добавить */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-4 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
      >
        {showForm ? 'Отмена' : 'Добавить навык'}
      </button>

      {/* Форма добавления */}
      {showForm && (
        <div className="mt-4 bg-gray-900 p-4 rounded-xl">
          <input
            type="text"
            placeholder="Название навыка"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-800 rounded text-gray-100"
          />

          {/* Выбор типа нагрузки */}
          <div className="mb-3">
            <label className="text-sm text-gray-300 mr-3">Тип выносливости:</label>
            <select
              value={enduranceType}
              onChange={(e) => setEnduranceType(e.target.value as 'mental' | 'physical')}
              className="bg-gray-800 text-gray-100 p-2 rounded"
            >
              <option value="mental">🧠 Ментальная</option>
              <option value="physical">💪 Физическая</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STAT_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm">{key}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={affinity[key]}
                  onChange={(e) =>
                    handleAffinityChange(key, parseFloat(e.target.value) || 0)
                  }
                  className="w-16 p-1 text-sm bg-gray-800 rounded text-center"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-3 px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
          >
            Создать
          </button>
        </div>
      )}
    </div>
  );
}
