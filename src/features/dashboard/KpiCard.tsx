'use client';

import { motion } from 'motion/react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { formatPct } from '@/lib/format';
import { Sparkline } from './Sparkline';

export function KpiCard({ label, value, delta, format, spark, color, loading, index }: { label: string; value: number; delta: number; format: (n: number) => string; spark: number[]; color: string; loading: boolean; index: number }) {
  const up = delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 200, damping: 22 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {loading ? (
        <div className="mt-2 space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
      ) : (
        <>
          <p className="mt-1 text-3xl font-extrabold tracking-tight"><AnimatedNumber value={value} format={format} /></p>
          <div className="mt-2 flex items-end justify-between">
            <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className={cn('rounded-full px-2 py-0.5 text-xs font-bold', up ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300')}>
              {up ? '▲' : '▼'} {formatPct(delta)}
            </motion.span>
            <Sparkline values={spark} color={color} />
          </div>
        </>
      )}
    </motion.div>
  );
}
