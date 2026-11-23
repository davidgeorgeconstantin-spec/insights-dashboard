import { DATA_END } from '@/data/generateOrders';
import type { Category, Granularity, Kpis, Order, RangeKey, SeriesPoint } from '@/types';
import { addDays, formatDay, formatMonth, monthKey, weekStart } from './dates';

/**
 * The same aggregations you'd write in SQL (see /sql/queries.sql), done in TypeScript.
 * Each function = one query: WHERE (range), GROUP BY (bucket), SUM / COUNT / AVG.
 */
export const RANGE_DAYS: Record<RangeKey, number> = { '7d': 7, '30d': 30, '90d': 90, '12m': 365 };
export const defaultGranularity = (r: RangeKey): Granularity => (r === '12m' ? 'month' : r === '90d' ? 'week' : 'day');

export function rangeBounds(range: RangeKey, end = DATA_END) {
  const days = RANGE_DAYS[range];
  const from = addDays(end, -(days - 1));
  return { from, to: end, prevFrom: addDays(from, -days), prevTo: addDays(from, -1) };
}

export const inRange = (o: Order, from: string, to: string) => o.date >= from && o.date <= to;

/** Refunded orders are excluded from revenue (like WHERE status <> 'refunded'). */
export function computeKpis(orders: Order[]): Kpis {
  const valid = orders.filter((o) => o.status !== 'refunded');
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  return { revenue, orders: valid.length, aov: valid.length ? revenue / valid.length : 0, customers: new Set(valid.map((o) => o.customer)).size };
}

export const change = (current: number, previous: number) => (previous ? (current - previous) / previous : 0);

/** GROUP BY day | week | month, with empty buckets filled with 0 so the chart has no gaps. */
export function revenueSeries(orders: Order[], from: string, to: string, g: Granularity): SeriesPoint[] {
  const bucketOf = (d: string) => (g === 'day' ? d : g === 'week' ? weekStart(d) : monthKey(d));
  const buckets = new Map<string, SeriesPoint>();
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const k = bucketOf(d);
    if (!buckets.has(k)) buckets.set(k, { key: k, label: g === 'month' ? formatMonth(k) : formatDay(k), revenue: 0, orders: 0 });
  }
  for (const o of orders) {
    if (o.status === 'refunded') continue;
    const b = buckets.get(bucketOf(o.date));
    if (!b) continue;
    b.revenue += o.total;
    b.orders += 1;
  }
  return [...buckets.values()];
}

export function topProducts(orders: Order[], limit = 6) {
  const map = new Map<string, { name: string; revenue: number; units: number }>();
  for (const o of orders) {
    if (o.status === 'refunded') continue;
    const row = map.get(o.product) ?? { name: o.product, revenue: 0, units: 0 };
    row.revenue += o.total;
    row.units += o.qty;
    map.set(o.product, row);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export function byCategory(orders: Order[]): { name: Category; value: number }[] {
  const map = new Map<Category, number>();
  for (const o of orders) if (o.status !== 'refunded') map.set(o.category, (map.get(o.category) ?? 0) + o.total);
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

/** CSV with proper escaping (quotes, commas, new lines). */
export function toCsv(orders: Order[]): string {
  const header = ['id', 'date', 'customer', 'city', 'product', 'category', 'qty', 'total', 'status'];
  const esc = (v: string | number) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [header.join(','), ...orders.map((o) => header.map((h) => esc(o[h as keyof Order])).join(','))].join('\n');
}
