import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppStore } from '../store';

// 🎨 Цветовая палитра
const COLORS = ['#6366F1', '#22C55E', '#A855F7', '#F59E0B', '#EF4444', '#3B82F6'];

export default function ChartsPanel() {
  const { level, exp, requiredExp, stats, skills, money, progressHistory } = useAppStore();

  // ===== 📊 ДАННЫЕ ДЛЯ ВИЗУАЛИЗАЦИИ =====

  // ⚙️ Уровни характеристик
  const statData = useMemo(
    () => Object.entries(stats).map(([key, st]) => ({ name: key, level: st.level })),
    [stats]
  );

  // ⚙️ Уровни навыков
  const skillData = useMemo(
    () => skills.map((s) => ({ name: s.name, level: s.level })),
    [skills]
  );

  // ⚙️ Прогресс EXP
  const progressData = [
    { name: 'Текущий опыт', value: exp },
    { name: 'До следующего уровня', value: requiredExp - exp },
  ];

  // ⚙️ История (для графиков по дням)
  const expHistory = progressHistory.map((p) => ({
    date: p.date,
    exp: p.exp,
    money: p.money,
    will: p.willpower,
    ment: p.mentalEndurance,
    phys: p.physicalEndurance,
  }));

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <h2 className="text-xl font-semibold mb-6 text-indigo-300">
        📊 Графики и статистика прогресса
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🔹 Прогресс EXP */}
        <ChartCard title="Прогресс до следующего уровня">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={progressData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {progressData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-400 mt-2">
            Уровень: <span className="text-indigo-400 font-semibold">{level}</span> / EXP:{' '}
            <span className="text-indigo-400 font-semibold">
              {exp}/{requiredExp}
            </span>
          </p>
        </ChartCard>

        {/* 🔹 Характеристики */}
        <ChartCard title="Характеристики (Stats)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="level" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 🔹 Навыки */}
        <ChartCard title="Навыки (Skills)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="level" fill="#A855F7" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 🔹 Баланс */}
        <ChartCard title="Баланс игрока">
          <div className="flex flex-col items-center justify-center h-[250px] text-2xl text-yellow-400">
            💰 {money.toFixed(2)} ₴
          </div>
        </ChartCard>

        {/* 🔹 EXP по дням */}
        <ChartCard title="EXP по дням">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={expHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="exp" name="EXP" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 🔹 Баланс по дням */}
        <ChartCard title="Баланс по дням">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={expHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="money"
                name="₴ Баланс"
                stroke="#FACC15"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 🔹 Сила воли и выносливость */}
        <ChartCard title="Сила воли и выносливость по дням">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={expHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="will"
                name="Willpower"
                stroke="#A855F7"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="ment"
                name="Mental Endurance"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="phys"
                name="Physical Endurance"
                stroke="#22C55E"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

// === Компонент карточки графика ===
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f0f10] border border-indigo-800 rounded-md p-4">
      <h3 className="text-indigo-400 font-medium mb-3">{title}</h3>
      {children}
    </div>
  );
}
