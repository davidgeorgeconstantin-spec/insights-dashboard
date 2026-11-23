'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Granularity, RangeKey } from '@/types';
import { defaultGranularity } from '@/lib/analytics';

interface SettingsState {
  range: RangeKey;
  granularity: Granularity;
  theme: 'light' | 'dark';
  setRange: (r: RangeKey) => void;
  setGranularity: (g: Granularity) => void;
  setTheme: (t: 'light' | 'dark') => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      range: '30d',
      granularity: 'day',
      theme: 'light',
      setRange: (range) => set({ range, granularity: defaultGranularity(range) }),
      setGranularity: (granularity) => set({ granularity }),
      setTheme: (theme) => set({ theme }),
    }),
    // skipHydration: we load localStorage AFTER the first render, so it matches the static HTML
    { name: 'insights:settings', skipHydration: true },
  ),
);
