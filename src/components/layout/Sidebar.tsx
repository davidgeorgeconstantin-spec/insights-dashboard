'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/', label: 'Overview', icon: 'M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z' },
  { href: '/orders/', label: 'Orders', icon: 'M4 6h16M4 12h16M4 18h10' },
];

export function Sidebar() {
  const pathname = usePathname();
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href.slice(0, -1)));

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur md:inset-y-0 md:left-0 md:right-auto md:w-60 md:border-r md:border-t-0 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="hidden items-center gap-2 px-6 py-6 text-lg font-extrabold md:flex">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500 text-white">▮</span> Insights
      </div>
      <nav className="flex justify-around p-2 md:flex-col md:gap-1 md:px-3">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={cn('relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold', active(n.href) ? 'text-sky-700 dark:text-sky-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}>
            {active(n.href) && <motion.span layoutId="side-active" className="absolute inset-0 rounded-xl bg-sky-50 dark:bg-sky-500/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={n.icon} /></svg>
            <span className="relative">{n.label}</span>
          </Link>
        ))}
      </nav>
      <p className="absolute bottom-6 hidden px-6 text-xs text-slate-400 md:block">Demo data, generated with a seeded random function. Learning project.</p>
    </aside>
  );
}
