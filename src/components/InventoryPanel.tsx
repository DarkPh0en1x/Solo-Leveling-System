import React, { useState } from 'react';
import { Backpack, Gem } from 'lucide-react';
import { useAppStore } from '../store';

export default function InventoryPanel() {
  const inventory = useAppStore((s) => s.inventory);
  const titles = useAppStore((s) => s.titles);
  const activeTitleId = useAppStore((s) => s.activeTitleId);
  const addItem = useAppStore((s) => s.addItem);
  const addTitle = useAppStore((s) => s.addTitle);
  const setActiveTitle = useAppStore((s) => s.setActiveTitle);

  const [newItem, setNewItem] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    addItem({
      id: Date.now().toString(),
      name: newItem,
      type: 'cosmetic',
      description: 'Косметический предмет без бонусов.',
      tags: [],
      pinned: false,
      equipped: false,
    });
    setNewItem('');
  };

  const handleAddTitle = () => {
    if (!newTitle.trim()) return;
    addTitle({
      id: Date.now().toString(),
      name: newTitle,
      description: 'Косметический титул, не дающий бонусов.',
    });
    setNewTitle('');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
        <Backpack size={20} /> Инвентарь и титулы
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Инвентарь */}
        <div>
          <h3 className="text-indigo-400 font-medium mb-2">Инвентарь</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Название предмета..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1 bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm text-gray-200"
            />
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Gem size={16} /> Добавить
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {inventory.length === 0 && (
              <p className="text-gray-400 italic text-sm">Инвентарь пуст...</p>
            )}
            {inventory.map((i) => (
              <div
                key={i.id}
                className="bg-[#0f0f10] border border-indigo-800 p-3 rounded-md text-sm"
              >
                <p className="text-indigo-300 font-semibold">{i.name}</p>
                <p className="text-gray-400">{i.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Титулы */}
        <div>
          <h3 className="text-indigo-400 font-medium mb-2">Титулы</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Новый титул..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm text-gray-200"
            />
            <button
              onClick={handleAddTitle}
              className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Добавить
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {titles.length === 0 && (
              <p className="text-gray-400 italic text-sm">Титулов пока нет...</p>
            )}
            {titles.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTitle(t.id)}
                className={`p-3 border rounded-md text-left ${
                  t.id === activeTitleId
                    ? 'bg-indigo-700/30 border-indigo-600 text-indigo-300'
                    : 'bg-[#0f0f10] border-indigo-800 hover:bg-indigo-900/30'
                }`}
              >
                <p className="font-semibold">{t.name}</p>
                <p className="text-gray-400 text-sm">{t.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
