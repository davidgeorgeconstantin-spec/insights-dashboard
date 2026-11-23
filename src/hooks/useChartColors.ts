'use client';

import { useSettings } from '@/features/settings/settingsStore';

/** Recharts needs real color values, so we pick them from the theme. */
export function useChartColors() {
  const dark = useSettings((s) => s.theme) === 'dark';
  return {
    primary: '#0ea5e9',
    secondary: '#8b5cf6',
    grid: dark ? '#1e293b' : '#e2e8f0',
    axis: dark ? '#64748b' : '#94a3b8',
    palette: ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#64748b'],
  };
}
