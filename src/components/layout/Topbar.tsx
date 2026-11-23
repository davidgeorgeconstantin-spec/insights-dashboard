'use client';

import { Segmented } from '@/components/ui/Segmented';
import { ThemeToggle } from '@/features/settings/ThemeToggle';
import { useSettings } from '@/features/settings/settingsStore';
import { formatDay } from '@/lib/dates';
import { rangeBounds } from '@/lib/analytics';
import type { RangeKey } from '@/types';

const RANGES = ['7d', '30d', '90d', '12m'] as const satisfies readonly RangeKey[];

export function Topbar({ title }: { title: string }) {
  const range = useSettings((s) => s.range);
  const setRange = useSettings((s) => s.setRange);
  const b = rangeBounds(range);

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {formatDay(b.from)} – {formatDay(b.to)} {b.to.slice(0, 4)} · compared with the previous {range}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Segmented id="range" options={RANGES} value={range} onChange={setRange} />
        <ThemeToggle />
      </div>
    </header>
  );
}
