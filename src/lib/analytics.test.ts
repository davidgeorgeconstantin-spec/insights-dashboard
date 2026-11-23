import { describe, expect, it } from 'vitest';
import { generateOrders } from '@/data/generateOrders';
import type { Order } from '@/types';
import { computeKpis, rangeBounds, revenueSeries, toCsv, topProducts } from './analytics';

const o = (p: Partial<Order>): Order => ({ id: '#1', date: '2026-11-01', customer: 'Ana', city: 'Cluj', product: 'Mug', category: 'Home', qty: 1, total: 100, status: 'completed', ...p });

describe('analytics', () => {
  it('generates the same data for the same seed', () => {
    expect(generateOrders(7).slice(0, 5)).toEqual(generateOrders(7).slice(0, 5));
  });

  it('excludes refunded orders from KPIs', () => {
    const k = computeKpis([o({ total: 100 }), o({ total: 50, customer: 'Ion' }), o({ total: 999, status: 'refunded' })]);
    expect(k).toEqual({ revenue: 150, orders: 2, aov: 75, customers: 2 });
  });

  it('builds a previous period of the same length', () => {
    const b = rangeBounds('7d', '2026-11-22');
    expect(b).toEqual({ from: '2026-11-16', to: '2026-11-22', prevFrom: '2026-11-09', prevTo: '2026-11-15' });
  });

  it('fills empty days with zero (no gaps in the chart)', () => {
    const s = revenueSeries([o({ date: '2026-11-02', total: 40 })], '2026-11-01', '2026-11-03', 'day');
    expect(s.map((p) => p.revenue)).toEqual([0, 40, 0]);
  });

  it('groups by month', () => {
    const s = revenueSeries([o({ date: '2026-10-31' }), o({ date: '2026-11-01' }), o({ date: '2026-11-20' })], '2026-10-01', '2026-11-30', 'month');
    expect(s.map((p) => [p.key, p.orders])).toEqual([['2026-10', 1], ['2026-11', 2]]);
  });

  it('ranks top products by revenue', () => {
    const top = topProducts([o({ product: 'A', total: 10 }), o({ product: 'B', total: 30 }), o({ product: 'A', total: 25 })]);
    expect(top.map((t) => t.name)).toEqual(['A', 'B']);
  });

  it('escapes commas and quotes in CSV', () => {
    const csv = toCsv([o({ customer: 'Pop, "Ana"' })]);
    expect(csv.split('\n')[1]).toContain('"Pop, ""Ana"""');
  });
});
