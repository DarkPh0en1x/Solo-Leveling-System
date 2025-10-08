import React from 'react';
import { Trophy } from 'lucide-react';
import { useAppStore } from '../store';

export default function AchievementsPanel() {
  const achievements = useAppStore((s) => s.achievements);

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
        <Trophy size={20} /> Достижения
      </h2>

      {achievements.length === 0 && (
        <p className="text-gray-400 italic text-sm">Достижений пока нет...</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`p-4 rounded-md border ${
              a.hidden
                ? 'border-gray-700 bg-gray-900/40 opacity-50'
                : 'border-indigo-800 bg-[#0f0f10]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={a.icon || '/trophy.png'}
                alt="achievement"
                className="w-10 h-10"
              />
              <div>
                <p className="font-semibold text-indigo-300">{a.title}</p>
                <p className="text-xs text-gray-400">{a.description}</p>
              </div>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-2 transition-all"
                style={{ width: `${a.progress}%` }}
              />
            </div>
            {a.achievedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Получено: {new Date(a.achievedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
