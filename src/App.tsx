import React, { useState } from 'react';
import Header from './components/Header';
import FocusPanel from './components/FocusPanel';
import SkillsPanel from './components/SkillsPanel';
import QuestsPanel from './components/QuestsPanel';
import StatsPanel from './components/StatsPanel';
import AchievementsPanel from './components/AchievementsPanel';
import MindBodyPanel from './components/MindBodyPanel';
import InventoryPanel from './components/InventoryPanel';
import ChartsPanel from './components/ChartsPanel';
import JournalPanel from './components/JournalPanel';
import SettingsPanel from './components/SettingsPanel';
import ShopPanel from './components/ShopPanel'; // 🆕 добавляем импорт Магазина

export default function App() {
  const [activeTab, setActiveTab] = useState('focus');

  const tabs = [
    { id: 'focus', label: 'Фокус' },
    { id: 'skills', label: 'Навыки' },
    { id: 'quests', label: 'Квесты' },
    { id: 'stats', label: 'Статы' },
    { id: 'achievements', label: 'Достижения' },
    { id: 'mindbody', label: 'Разум и тело' },
    { id: 'inventory', label: 'Инвентарь' },
    { id: 'shop', label: 'Магазин' }, // 🆕 добавляем вкладку
    { id: 'charts', label: 'Графики' },
    { id: 'journal', label: 'Журнал' },
    { id: 'settings', label: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f10] text-gray-200 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'focus' && <FocusPanel />}
        {activeTab === 'skills' && <SkillsPanel />}
        {activeTab === 'quests' && <QuestsPanel />}
        {activeTab === 'stats' && <StatsPanel />}
        {activeTab === 'achievements' && <AchievementsPanel />}
        {activeTab === 'mindbody' && <MindBodyPanel />}
        {activeTab === 'inventory' && <InventoryPanel />}
        {activeTab === 'shop' && <ShopPanel />} {/* 🆕 выводим Магазин */}
        {activeTab === 'charts' && <ChartsPanel />}
        {activeTab === 'journal' && <JournalPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}
