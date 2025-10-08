import React from 'react';
import { Crown } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: { id: string; label: string }[];
}

export default function Header({ activeTab, setActiveTab, tabs }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#121212] border-b border-indigo-600/40 shadow-neon">
      <div className="flex items-center gap-3">
        <Crown className="text-indigo-400" size={22} />
        <h1 className="text-xl font-semibold text-indigo-300 select-none">
          Solo Leveling System
        </h1>
      </div>

      <nav className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-neon'
                  : 'text-gray-400 hover:text-indigo-300 hover:bg-indigo-900/40'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="text-sm text-indigo-400 italic">
        <span className="opacity-70">Титул:</span> Восходящий
      </div>
    </header>
  );
}
