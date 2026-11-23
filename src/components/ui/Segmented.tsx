'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/cn';

/** Segmented control with a sliding pill (shared layoutId). */
export function Segmented<T extends string>({ id, options, value, onChange, labels }: { id: string; options: readonly T[]; value: T; onChange: (v: T) => void; labels?: Partial<Record<T, string>> }) {
  return (
    <div role="radiogroup" className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {options.map((o) => (
        <button
          key={o}
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn('relative rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors', value === o ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200')}
        >
          {value === o && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-700" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
          <span className="relative">{labels?.[o] ?? o}</span>
        </button>
      ))}
    </div>
  );
}
