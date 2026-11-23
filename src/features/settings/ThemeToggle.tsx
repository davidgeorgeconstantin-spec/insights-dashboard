'use client';

import { AnimatePresence, motion } from 'motion/react';
import { flushSync } from 'react-dom';
import { useSettings } from './settingsStore';

/**
 * Dark mode toggle with a circular reveal, using the View Transitions API.
 * Browsers without the API (or users with reduced motion) get an instant switch.
 */
export function ThemeToggle() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const next = theme === 'dark' ? 'light' : 'dark';

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) return setTheme(next);

    const x = e.clientX;
    const y = e.clientY;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
      document.documentElement.classList.toggle('dark', next === 'dark');
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }

  return (
    <button onClick={toggle} className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700" aria-label={`Switch to ${next} mode`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ y: 20, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: -20, rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
