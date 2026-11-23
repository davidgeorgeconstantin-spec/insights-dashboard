'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Segmented';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSettings } from '@/features/settings/settingsStore';
import { useChartColors } from '@/hooks/useChartColors';
import { formatCompact, formatMoney } from '@/lib/format';
import type { Granularity, SeriesPoint } from '@/types';

const GRAN = ['day', 'week', 'month'] as const satisfies readonly Granularity[];

function ChartTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const p = payload[0]!.payload as SeriesPoint;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-sm shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <p className="font-semibold">{label}</p>
      <p className="text-sky-600 dark:text-sky-400">{formatMoney(p.revenue)}</p>
      <p className="text-slate-500">{p.orders} orders</p>
    </div>
  );
}

export function RevenueChart({ data, loading }: { data: SeriesPoint[]; loading: boolean }) {
  const c = useChartColors();
  const granularity = useSettings((s) => s.granularity);
  const setGranularity = useSettings((s) => s.setGranularity);

  return (
    <Card title="Revenue" action={<Segmented id="gran" options={GRAN} value={granularity} onChange={setGranularity} labels={{ day: 'Daily', week: 'Weekly', month: 'Monthly' }} />}>
      <div className="h-72">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={c.primary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={c.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={c.grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: c.axis, fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickFormatter={(v: number) => formatCompact(v)} tick={{ fill: c.axis, fontSize: 12 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip content={(props) => <ChartTooltip {...(props as TooltipContentProps<number, string>)} />} cursor={{ stroke: c.axis, strokeDasharray: 4 }} />
              <Area type="monotone" dataKey="revenue" stroke={c.primary} strokeWidth={2.5} fill="url(#rev)" animationDuration={900} activeDot={{ r: 5, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
