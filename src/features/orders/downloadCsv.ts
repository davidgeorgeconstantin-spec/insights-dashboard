import { toCsv } from '@/lib/analytics';
import type { Order } from '@/types';

/** Creates a file in memory (Blob) and clicks a temporary link to download it. */
export function downloadCsv(orders: Order[], filename: string) {
  const blob = new Blob(['\uFEFF' + toCsv(orders)], { type: 'text/csv;charset=utf-8' }); // BOM → Excel shows ă, ș correctly
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}
