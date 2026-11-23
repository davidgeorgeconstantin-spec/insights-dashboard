'use client';

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Segmented } from '@/components/ui/Segmented';
import { Skeleton } from '@/components/ui/Skeleton';
import { ORDERS } from '@/data/generateOrders';
import { useSettings } from '@/features/settings/settingsStore';
import { useDebounced } from '@/hooks/useDebounced';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { inRange, rangeBounds } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/format';
import { columns } from './columns';
import { downloadCsv } from './downloadCsv';

const STATUS = ['all', 'completed', 'processing', 'refunded'] as const;

export function OrdersTable() {
  const range = useSettings((s) => s.range);
  const data = useMemo(() => {
    const b = rangeBounds(range);
    return ORDERS.filter((o) => inRange(o, b.from, b.to));
  }, [range]);

  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  const [search, setSearch] = useState('');
  const globalFilter = useDebounced(search, 200);
  const [status, setStatus] = useState<(typeof STATUS)[number]>('all');
  const columnFilters = useMemo<ColumnFiltersState>(() => (status === 'all' ? [] : [{ id: 'status', value: status }]), [status]);
  const loading = useSimulatedLoading(range, 450);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
    autoResetPageIndex: true,
  });

  const filtered = table.getFilteredRowModel().rows.map((r) => r.original);
  const filteredTotal = filtered.reduce((s, o) => s + (o.status === 'refunded' ? 0 : o.total), 0);
  const { pageIndex } = table.getState().pagination;

  return (
    <>
      <Topbar title="Orders" />
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer, product, city…" aria-label="Search orders" className="w-64 rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700" />
            <Segmented id="status" options={STATUS} value={status} onChange={setStatus} labels={{ all: 'All', completed: 'Completed', processing: 'Processing', refunded: 'Refunded' }} />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500"><b className="text-slate-900 dark:text-white">{filtered.length}</b> orders · {formatMoney(filteredTotal)}</p>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => downloadCsv(filtered, `orders-${range}.csv`)} className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-500/30">
              ⬇ Export CSV
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="text-left text-slate-500">
                  {hg.headers.map((h) => {
                    const sorted = h.column.getIsSorted();
                    const align = (h.column.columnDef.meta as { align?: string } | undefined)?.align;
                    return (
                      <th key={h.id} className={cn('px-4 py-3 font-medium', align === 'right' && 'text-right')} aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}>
                        <button onClick={h.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          <motion.span animate={{ rotate: sorted === 'desc' ? 180 : 0, opacity: sorted ? 1 : 0.25 }} className="text-xs">▲</motion.span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 12 }, (_, i) => (
                    <tr key={i}><td colSpan={columns.length} className="px-4 py-2"><Skeleton className="h-7" /></td></tr>
                  ))
                : (
                  <AnimatePresence initial={false} mode="popLayout">
                    {table.getRowModel().rows.map((row, i) => (
                      <motion.tr
                        key={row.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.015, duration: 0.2 }}
                        className="border-t border-slate-100 hover:bg-sky-50/60 dark:border-slate-800 dark:hover:bg-sky-500/5"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className={cn('px-4 py-2.5', (cell.column.columnDef.meta as { align?: string } | undefined)?.align === 'right' && 'text-right')}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <p className="py-16 text-center text-slate-500">No orders match.</p>}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
          <span className="text-slate-500">Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
          <div className="flex gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700">← Prev</button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700">Next →</button>
          </div>
        </div>
      </div>
    </>
  );
}
