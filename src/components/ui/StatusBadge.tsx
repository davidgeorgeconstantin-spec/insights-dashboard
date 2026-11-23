import { cn } from '@/lib/cn';
import type { OrderStatus } from '@/types';

const STYLES: Record<OrderStatus, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  processing: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  refunded: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', STYLES[status])}>{status}</span>;
}
