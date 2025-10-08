import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ShoppingCart, PlusCircle, Trash2, Coins } from 'lucide-react';

// Типы для удобства
interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
}

export default function ShopPanel() {
  const { money, shopItems, purchases } = useAppStore();
  const addShopItem = useAppStore((s) => s.addShopItem);
  const deleteShopItem = useAppStore((s) => s.deleteShopItem);
  const buyItem = useAppStore((s) => s.buyItem);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [priceInput, setPriceInput] = useState(''); // ввод как строка
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return alert('Введите название товара');

    // Преобразуем ввод в число и проверяем
    const parsedPrice = parseFloat(priceInput);
    const price = isNaN(parsedPrice) ? 0 : Math.max(0, parsedPrice);

    addShopItem({
      id: Date.now().toString(),
      name: name.trim(),
      price,
      description: description.trim(),
      active: true,
    });

    setName('');
    setPriceInput('');
    setDescription('');
    setShowForm(false);
  };

  // Безопасное отображение баланса
  const safeMoney = isNaN(money) ? 0 : money;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-[#18181b] p-6 rounded-2xl shadow-lg border border-indigo-700/30">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
        <ShoppingCart size={20} /> Магазин
      </h2>

      {/* Баланс */}
      <div className="flex justify-between items-center mb-4 bg-[#0f0f10] p-3 rounded-lg border border-indigo-800">
        <span className="text-gray-300 font-semibold">Баланс:</span>
        <span className="text-yellow-400 flex items-center gap-2">
          <Coins size={18} /> {safeMoney.toFixed(2)} ₴
        </span>
      </div>

      {/* Кнопка добавления товара */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded flex items-center gap-2"
      >
        <PlusCircle size={18} />
        {showForm ? 'Отмена' : 'Добавить товар'}
      </button>

      {/* Форма добавления */}
      {showForm && (
        <div className="bg-[#0f0f10] p-4 rounded-lg mb-6 border border-indigo-800">
          <input
            type="text"
            placeholder="Название товара"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 p-2 bg-gray-800 rounded text-sm text-gray-100"
          />
          <input
            type="number"
            placeholder="Цена (₴)"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="w-full mb-2 p-2 bg-gray-800 rounded text-sm text-gray-100"
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-2 p-2 bg-gray-800 rounded text-sm text-gray-100"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            Добавить
          </button>
        </div>
      )}

      {/* Список товаров */}
      <h3 className="text-indigo-400 mb-2 font-semibold">Товары</h3>
      {shopItems.length === 0 && (
        <p className="text-gray-500 text-sm italic mb-4">Нет доступных товаров...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {shopItems.map((item: ShopItem) => (
          <div
            key={item.id}
            className="bg-[#0f0f10] border border-indigo-800 p-4 rounded-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-semibold text-indigo-300">{item.name}</span>
                <span className="text-yellow-400">
                  {isNaN(item.price) ? 0 : item.price} ₴
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{item.description || '—'}</p>
            </div>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => buyItem(item.id)}
                disabled={!item.active}
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  item.active
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.price === 0 ? 'Получить бесплатно' : 'Купить'}
              </button>
              <button
                onClick={() => deleteShopItem(item.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
              >
                <Trash2 size={14} /> Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* История покупок */}
      <h3 className="text-indigo-400 mb-2 font-semibold">История покупок</h3>
      {purchases.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Пока ничего не куплено...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {purchases.map((p) => (
            <div
              key={p.id}
              className="bg-[#0f0f10] border border-indigo-800 p-3 rounded-md text-sm flex justify-between"
            >
              <span>{p.nameSnapshot}</span>
              <span className="text-yellow-400">
                {isNaN(p.price) ? 0 : `-${p.price}`} ₴
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
