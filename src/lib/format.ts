const money = new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
export const formatMoney = (n: number) => money.format(n);
export const formatCompact = (n: number) => compact.format(n);
export const formatInt = (n: number) => Math.round(n).toLocaleString('en-US');
export const formatPct = (n: number) => `${n > 0 ? '+' : ''}${(n * 100).toFixed(1)}%`;
