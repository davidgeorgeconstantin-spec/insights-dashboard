/** Date helpers working on 'YYYY-MM-DD' strings in UTC (no timezone surprises). */
export const toKey = (d: Date) => d.toISOString().slice(0, 10);
export const fromKey = (k: string) => new Date(`${k}T00:00:00Z`);
export const addDays = (k: string, n: number) => {
  const d = fromKey(k);
  d.setUTCDate(d.getUTCDate() + n);
  return toKey(d);
};
export const weekStart = (k: string) => {
  const d = fromKey(k);
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  return addDays(k, -day);
};
export const monthKey = (k: string) => k.slice(0, 7);

const dayFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' });
export const formatDay = (k: string) => dayFmt.format(fromKey(k));
export const formatMonth = (k: string) => monthFmt.format(fromKey(`${k}-01`));
