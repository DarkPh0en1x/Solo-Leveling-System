import React, { useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { useAppStore } from '../store';

export default function MindBodyPanel() {
  const addMindBodyDay = useAppStore((s) => s.addMindBodyEntry);
  const mindBody = useAppStore((s) => s.mindBodyDays);
  const [mood, setMood] = useState('нейтральное');
  const [fatigue, setFatigue] = useState(50);
  const [wellbeing, setWellbeing] = useState(50);
  const [motivation, setMotivation] = useState(5);

  const handleSave = () => {
    addMindBodyDay({
      date: new Date().toISOString(),
      mood,
      fatigue,
      wellbeing,
      motivation,
      focusScore: Math.round((10 - fatigue / 10 + wellbeing / 10 + motivation) / 3),
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
        <HeartPulse size={20} /> Разум и тело
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-400">Настроение:</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm"
          >
            <option value="радостное">Радостное</option>
            <option value="спокойное">Спокойное</option>
            <option value="нейтральное">Нейтральное</option>
            <option value="уставшее">Уставшее</option>
            <option value="раздражённое">Раздражённое</option>
            <option value="тревожное">Тревожное</option>
          </select>
        </div>

        <RangeInput label="Усталость" value={fatigue} setValue={setFatigue} />
        <RangeInput label="Самочувствие" value={wellbeing} setValue={setWellbeing} />
        <RangeInput label="Мотивация" value={motivation} setValue={setMotivation} max={10} />
      </div>

      <button
        onClick={handleSave}
        className="px-5 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Сохранить состояние
      </button>

      <div className="mt-8">
        <h3 className="text-indigo-400 font-medium mb-3">Журнал состояний</h3>
        {mindBody.length === 0 && (
          <p className="text-gray-400 italic text-sm">Нет записей...</p>
        )}
        <div className="flex flex-col gap-2">
          {mindBody.map((d) => (
            <div
              key={d.date}
              className="bg-[#0f0f10] border border-indigo-800 rounded-md p-3 text-sm"
            >
              <p className="text-indigo-300 font-semibold">
                {new Date(d.date).toLocaleDateString()} ({d.mood})
              </p>
              <p className="text-gray-400">
                Усталость: {d.fatigue}, Самочувствие: {d.wellbeing}, Мотивация: {d.motivation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RangeInput({
  label,
  value,
  setValue,
  max = 100,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  max?: number;
}) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}: {value}</label>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </div>
  );
}
