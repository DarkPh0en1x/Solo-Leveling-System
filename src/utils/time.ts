// Форматирование минут в строку "чч:мм"
export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}`;
}

// Разница в часах между двумя датами
export function differenceInHours(date1: Date, date2: Date): number {
  const diff = date1.getTime() - date2.getTime();
  return diff / (1000 * 60 * 60);
}

// Сегодняшняя дата в ISO (без времени)
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Возвращает строку в формате "дд.мм.гггг"
export function formatDateReadable(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}.${String(
    d.getMonth() + 1
  ).padStart(2, '0')}.${d.getFullYear()}`;
}
