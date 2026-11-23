'use client';

import { useMemo } from 'react';
import { ORDERS } from '@/data/generateOrders';
import { byCategory, change, computeKpis, inRange, rangeBounds, revenueSeries, topProducts } from '@/lib/analytics';
import { useSettings } from '@/features/settings/settingsStore';

/** All dashboard numbers for the selected range. useMemo → recomputed only when range/granularity change. */
export function useDashboardData() {
  const range = useSettings((s) => s.range);
  const granularity = useSettings((s) => s.granularity);

  return useMemo(() => {
    const b = rangeBounds(range);
    const current = ORDERS.filter((o) => inRange(o, b.from, b.to));
    const previous = ORDERS.filter((o) => inRange(o, b.prevFrom, b.prevTo));
    const k = computeKpis(current);
    const p = computeKpis(previous);
    return {
      bounds: b,
      kpis: k,
      deltas: { revenue: change(k.revenue, p.revenue), orders: change(k.orders, p.orders), aov: change(k.aov, p.aov), customers: change(k.customers, p.customers) },
      series: revenueSeries(current, b.from, b.to, granularity),
      // small daily sparkline per KPI
      spark: revenueSeries(current, b.from, b.to, range === '12m' ? 'week' : 'day'),
      top: topProducts(current),
      categories: byCategory(current),
      recent: current.slice(0, 6),
    };
  }, [range, granularity]);
}
