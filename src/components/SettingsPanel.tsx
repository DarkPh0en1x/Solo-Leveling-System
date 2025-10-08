import React, { useState } from 'react';
import { Settings, Database, Download, Upload } from 'lucide-react';
import { useAppStore } from '../store';

export default function SettingsPanel() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleConfigChange = (key: string, value: number) => {
    setConfig({ ...config, [key]: value });
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!parsed || typeof parsed !== 'object') throw new Error('Некорректный формат данных');

      importData(parsed);
      setImportText('');
      setStatus({ type: 'success', message: '✅ Данные успешно импортированы.' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: '❌ Ошибка импорта: некорректный JSON или версия.' });
    }
  };

  const handleExport = () => {
    try {
      exportData();
      setStatus({ type: 'success', message: '📤 Экспорт успешно выполнен. Файл JSON сохранён.' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Ошибка при экспорте данных.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30 space-y-8">
      <h2 className="text-xl font-semibold text-indigo-300 flex items-center gap-2">
        <Settings size={20} /> Настройки и формулы
      </h2>

      {/* === Формулы EXP === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingInput
          label="EXP базовый множитель (study)"
          value={config.studyWeight}
          onChange={(v) => handleConfigChange('studyWeight', v)}
        />
        <SettingInput
          label="EXP множитель (practice)"
          value={config.practiceWeight}
          onChange={(v) => handleConfigChange('practiceWeight', v)}
        />
        <SettingInput
          label="EXP множитель (review)"
          value={config.reviewWeight}
          onChange={(v) => handleConfigChange('reviewWeight', v)}
        />
        <SettingInput
          label="Порог уровня EXP (+100 за уровень)"
          value={config.expLevelPower}
          onChange={(v) => handleConfigChange('expLevelPower', v)}
        />
      </div>

      {/* === Управление данными === */}
      <div className="bg-[#111114] p-4 rounded-xl border border-indigo-800/40">
        <h3 className="text-indigo-400 text-lg font-semibold mb-3 flex items-center gap-2">
          <Database size={18} /> Управление сохранениями
        </h3>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            <Download size={16} /> Экспорт JSON
          </button>

          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition"
          >
            <Upload size={16} /> Импорт JSON
          </button>
        </div>

        {status.type && (
          <div
            className={`p-2 text-sm rounded-md ${
              status.type === 'success' ? 'bg-green-800/30 text-green-400' : 'bg-red-800/30 text-red-400'
            }`}
          >
            {status.message}
          </div>
        )}

        <textarea
          placeholder="Вставь сюда JSON для импорта..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          className="w-full h-40 bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm text-gray-200 mt-4"
        />

        <p className="text-xs text-gray-500 italic mt-3">
          ⚠️ Данные хранятся локально (localStorage + IndexedDB). <br />
          Убедись, что выполнил экспорт перед очисткой браузера или обновлением версии.
        </p>
      </div>
    </div>
  );
}

function SettingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full bg-[#0f0f10] border border-indigo-800 rounded-md p-2 text-sm text-gray-200"
      />
    </div>
  );
}
