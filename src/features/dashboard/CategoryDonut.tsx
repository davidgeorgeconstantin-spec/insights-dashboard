'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useChartColors } from '@/hooks/useChartColors';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/format';

export function CategoryDonut({ data, loading }: { data: { name: string; value: number }[]; loading: boolean }) {
  const c = useChartColors();
  const [active, setActive] = useState(0);
  const total = data.reduce((s, d) => s + d.value, 0);
  const current = data[active] ?? data[0];

  return (
    <Card title="Sales by category">
      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto] xl:grid-cols-1 2xl:grid-cols-[1fr_auto]">
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius="64%" outerRadius="92%" paddingAngle={3} cornerRadius={6} stroke="none" animationDuration={800} onMouseEnter={(_, i) => setActive(i)}>
                  {data.map((d, i) => <Cell key={d.name} fill={c.palette[i % c.palette.length]} opacity={i === active ? 1 : 0.45} style={{ transition: 'opacity .2s', cursor: 'pointer' }} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div key={current.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.18 }}>
                    <p className="text-xs text-slate-500">{current.name}</p>
                    <p className="text-lg font-bold">{total ? Math.round((current.value / total) * 100) : 0}%</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            {data.map((d, i) => (
              <li key={d.name}>
                <button onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-1 transition', i === active && 'bg-slate-100 dark:bg-slate-800')}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.palette[i % c.palette.length] }} />
                  <span className="flex-1 text-left">{d.name}</span>
                  <span className="tabular-nums text-slate-500">{formatMoney(d.value)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
