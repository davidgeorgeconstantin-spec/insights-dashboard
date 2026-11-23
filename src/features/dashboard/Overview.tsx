'use client';

import { Topbar } from '@/components/layout/Topbar';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { formatInt, formatMoney } from '@/lib/format';
import { useSettings } from '@/features/settings/settingsStore';
import { CategoryDonut } from './CategoryDonut';
import { KpiCard } from './KpiCard';
import { RecentOrders } from './RecentOrders';
import { RevenueChart } from './RevenueChart';
import { TopProducts } from './TopProducts';

export function Overview() {
  const d = useDashboardData();
  const range = useSettings((s) => s.range);
  const granularity = useSettings((s) => s.granularity);
  const loading = useSimulatedLoading(range);
  const chartLoading = useSimulatedLoading(`${range}-${granularity}`, 350);
  const revenueSpark = d.spark.map((p) => p.revenue);
  const ordersSpark = d.spark.map((p) => p.orders);

  const kpis = [
    { label: 'Revenue', value: d.kpis.revenue, delta: d.deltas.revenue, format: formatMoney, spark: revenueSpark, color: '#0ea5e9' },
    { label: 'Orders', value: d.kpis.orders, delta: d.deltas.orders, format: formatInt, spark: ordersSpark, color: '#8b5cf6' },
    { label: 'Average order value', value: d.kpis.aov, delta: d.deltas.aov, format: formatMoney, spark: d.spark.map((p) => (p.orders ? p.revenue / p.orders : 0)), color: '#f59e0b' },
    { label: 'Customers', value: d.kpis.customers, delta: d.deltas.customers, format: formatInt, spark: ordersSpark, color: '#10b981' },
  ];

  return (
    <>
      <Topbar title="Overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} loading={loading} index={i} />)}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2"><RevenueChart data={d.series} loading={chartLoading} /></div>
        <CategoryDonut data={d.categories} loading={loading} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <TopProducts data={d.top} loading={loading} />
        <RecentOrders orders={d.recent} />
      </div>
    </>
  );
}
