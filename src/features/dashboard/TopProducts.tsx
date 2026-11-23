'use client';

import { motion } from 'motion/react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatMoney } from '@/lib/format';

/** Horizontal bars animated with Motion (scaleX from the left). */
export function TopProducts({ data, loading }: { data: { name: string; revenue: number; units: number }[]; loading: boolean }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <Card title="Top products">
      <ul className="space-y-3.5">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-9" />)
          : data.map((p, i) => (
              <motion.li key={p.name} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="tabular-nums text-slate-500">{formatMoney(p.revenue)} · {p.units} pcs</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-sky-500 to-violet-500" initial={{ scaleX: 0 }} animate={{ scaleX: p.revenue / max }} transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 90, damping: 18 }} />
                </div>
              </motion.li>
            ))}
      </ul>
    </Card>
  );
}
