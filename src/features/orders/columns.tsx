import { createColumnHelper } from '@tanstack/react-table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDay } from '@/lib/dates';
import { formatMoney } from '@/lib/format';
import type { Order } from '@/types';

const col = createColumnHelper<Order>();

export const columns = [
  col.accessor('id', { header: 'Order', cell: (c) => <span className="font-mono text-xs">{c.getValue()}</span> }),
  col.accessor('date', { header: 'Date', cell: (c) => `${formatDay(c.getValue())} ${c.getValue().slice(0, 4)}` }),
  col.accessor('customer', { header: 'Customer', cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
  col.accessor('city', { header: 'City' }),
  col.accessor('product', { header: 'Product' }),
  col.accessor('qty', { header: 'Qty', meta: { align: 'right' } }),
  col.accessor('total', { header: 'Total', cell: (c) => <span className="font-semibold tabular-nums">{formatMoney(c.getValue())}</span>, meta: { align: 'right' } }),
  col.accessor('status', { header: 'Status', cell: (c) => <StatusBadge status={c.getValue()} />, filterFn: 'equalsString' }),
];
