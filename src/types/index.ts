export type OrderStatus = 'completed' | 'processing' | 'refunded';
export type Category = 'Coffee' | 'Equipment' | 'Apparel' | 'Home';

export interface Order {
  id: string;
  date: string; // YYYY-MM-DD
  customer: string;
  city: string;
  product: string;
  category: Category;
  qty: number;
  total: number; // RON
  status: OrderStatus;
}

export type RangeKey = '7d' | '30d' | '90d' | '12m';
export type Granularity = 'day' | 'week' | 'month';

export interface Kpis {
  revenue: number;
  orders: number;
  aov: number; // average order value
  customers: number;
}

export interface SeriesPoint {
  key: string; // bucket key (date / week start / month)
  label: string;
  revenue: number;
  orders: number;
}
