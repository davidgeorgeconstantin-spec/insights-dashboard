'use client';

import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { useSettings } from '@/features/settings/settingsStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    void useSettings.persist.rehydrate(); // load saved range/theme after hydration
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
