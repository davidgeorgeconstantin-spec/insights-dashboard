'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDay } from '@/lib/dates';
import { formatMoney } from '@/lib/format';
import type { Order } from '@/types';

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Card title="Latest orders" action={<Link href="/orders/" className="text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400">View all →</Link>}>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {orders.map((o, i) => (
          <motion.li key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-bold dark:bg-slate-800">{o.customer.split(' ').map((w) => w[0]).join('')}</span>
            <span className="flex-1">
              <span className="block font-medium">{o.customer}</span>
              <span className="text-slate-500">{o.product} · {formatDay(o.date)}</span>
            </span>
            <StatusBadge status={o.status} />
            <span className="w-24 text-right font-semibold tabular-nums">{formatMoney(o.total)}</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}
