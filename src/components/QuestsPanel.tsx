import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store';
import { differenceInHours } from '../utils/time';

export default function QuestsPanel() {
  const quests = useAppStore((s) => s.quests);
  const addQuest = useAppStore((s) => s.addQuest);
  const completeQuest = useAppStore((s) => s.completeQuest);
  const failQuest = useAppStore((s) => s.failQuest);
  const skills = useAppStore((s) => s.skills);

  const [newQuest, setNewQuest] = useState('');
  const [type, setType] = useState<'daily' | 'weekly' | 'story' | 'reactive'>('daily');
  const [skillId, setSkillId] = useState<string | null>(null);
  const [reward, setReward] = useState<number>(0); // 💰 новое состояние

  // Проверка истекших внезапных квестов каждые 10 мин
  useEffect(() => {
    const checkExpired = setInterval(() => {
      const now = Date.now();
      quests.forEach((q) => {
        if (q.type === 'reactive' && q.status === 'open' && q.deadline) {
          const hours = differenceInHours(new Date(q.deadline), new Date(now));
          if (hours <= 0) failQuest(q.id);
        }
      });
    }, 600000);
    return () => clearInterval(checkExpired);
  }, [quests]);

  const handleAdd = () => {
    if (!newQuest.trim()) return;
    const quest = {
      id: Date.now().toString(),
      title: newQuest.trim(),
      description: '',
      type,
      skillId,
      plannedMinutes: 60,
      reward, // 💰 добавили награду
      createdAt: new Date().toISOString(),
      status: 'open',
      deadline:
        type === 'reactive'
          ? new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
          : undefined,
    };
    addQuest(quest);
    setNewQuest('');
    setReward(0);
  };

  const open = quests.filter((q) => q.status === 'open');
  const done = quests.filter((q) => q.status === 'done');
  const failed = quests.filter((q) => q.status === 'failed');

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300">Квесты</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Название квеста..."
          value={newQuest}
          onChange={(e) => setNewQuest(e.target.value)}
          className="flex-1 bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm text-gray-200"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm"
        >
          <option value="daily">Ежедневный</option>
          <option value="weekly">Недельный</option>
          <option value="story">Сюжетный</option>
          <option value="reactive">Внезапный</option>
        </select>

        <select
          value={skillId ?? ''}
          onChange={(e) => setSkillId(e.target.value || null)}
          className="bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm"
        >
          <option value="">Без навыка</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* 💰 поле награды */}
        <input
          type="number"
          placeholder="Вознаграждение (₴)"
          value={reward}
          onChange={(e) => setReward(parseInt(e.target.value) || 0)}
          className="w-32 bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm text-gray-200"
          min="0"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <PlusCircle size={18} /> Добавить
        </button>
      </div>

      <QuestList title="Активные" items={open} onDone={completeQuest} onFail={failQuest} />
      <QuestList title="Выполненные" items={done} />
      <QuestList title="Проваленные" items={failed} failed />
    </div>
  );
}

function QuestList({
  title,
  items,
  onDone,
  onFail,
  failed = false,
}: {
  title: string;
  items: any[];
  onDone?: (id: string) => void;
  onFail?: (id: string) => void;
  failed?: boolean;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-indigo-400 font-medium mb-3">{title}</h3>
      {items.length === 0 && (
        <p className="text-gray-500 text-sm italic">Нет квестов...</p>
      )}

      <div className="flex flex-col gap-2">
        {items.map((q) => (
          <div
            key={q.id}
            className={`p-3 rounded-md border ${
              failed
                ? 'border-red-700 bg-red-900/20'
                : q.status === 'done'
                ? 'border-green-700 bg-green-900/20'
                : 'border-indigo-800 bg-[#0f0f10]'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-indigo-300">{q.title}</p>
                <p className="text-xs text-gray-400 capitalize">
                  {q.type}{' '}
                  {q.deadline && `(до ${new Date(q.deadline).toLocaleTimeString()})`}
                </p>

                {/* 💰 отображение вознаграждения */}
                {q.reward ? (
                  <p className="text-xs text-green-400 mt-1">
                    💰 Награда: {q.reward} ₴
                  </p>
                ) : null}
              </div>

              {onDone && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onDone(q.id)}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded flex items-center gap-1 text-sm"
                  >
                    <CheckCircle2 size={14} /> Завершить
                  </button>
                  <button
                    onClick={() => onFail && onFail(q.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded flex items-center gap-1 text-sm"
                  >
                    <AlertTriangle size={14} /> Провал
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
