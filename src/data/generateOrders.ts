import { addDays } from '@/lib/dates';
import { mulberry32 } from '@/lib/random';
import type { Category, Order, OrderStatus } from '@/types';

/** The demo dataset ends on this day (fixed, so the static HTML and the browser render the same thing). */
export const DATA_END = '2026-11-22';
export const DATA_DAYS = 365 * 2;

const PRODUCTS: { name: string; category: Category; price: number }[] = [
  { name: 'Ethiopia Yirgacheffe', category: 'Coffee', price: 69 },
  { name: 'Colombia Huila', category: 'Coffee', price: 59 },
  { name: 'Brazil Santos', category: 'Coffee', price: 49 },
  { name: 'Decaf Swiss Water', category: 'Coffee', price: 64 },
  { name: 'Pour-over Kettle', category: 'Equipment', price: 189 },
  { name: 'Hand Grinder Pro', category: 'Equipment', price: 249 },
  { name: 'Ceramic Dripper', category: 'Equipment', price: 89 },
  { name: 'Barista T-shirt', category: 'Apparel', price: 99 },
  { name: 'Canvas Apron', category: 'Apparel', price: 139 },
  { name: 'Stoneware Mug', category: 'Home', price: 45 },
  { name: 'Coffee Gift Box', category: 'Home', price: 179 },
];
const FIRST = ['Ana', 'Mihai', 'Ioana', 'Andrei', 'Elena', 'Radu', 'Maria', 'Vlad', 'Cristina', 'Alex', 'Diana', 'George', 'Irina', 'Paul', 'Larisa', 'Tudor', 'Bianca', 'Ștefan', 'Oana', 'Cătălin', 'Raluca', 'Bogdan', 'Alina', 'Sorin', 'Daria', 'Cosmin', 'Teodora', 'Marius', 'Ilinca', 'Adrian'];
const LAST = ['Popescu', 'Ionescu', 'Stan', 'Dumitru', 'Matei', 'Georgescu', 'Constantin', 'Marin', 'Tudor', 'Florea', 'Barbu', 'Nistor', 'Lungu', 'Moldovan', 'Rusu', 'Ene', 'Toma', 'Sandu', 'Cristea', 'Neagu', 'Pavel', 'Mocanu', 'Oprea', 'Voicu'];
const CITIES = ['București', 'Cluj-Napoca', 'Iași', 'Timișoara', 'Brașov', 'Constanța', 'Sibiu', 'Oradea'];

/**
 * Fake but realistic orders: growth over time, more orders on weekends, a November/December peak.
 * Seeded → identical on every build.
 */
export function generateOrders(seed = 42): Order[] {
  const rand = mulberry32(seed);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]!;
  const orders: Order[] = [];
  const start = addDays(DATA_END, -(DATA_DAYS - 1));
  let n = 1000;

  for (let i = 0; i < DATA_DAYS; i++) {
    const date = addDays(start, i);
    const d = new Date(`${date}T00:00:00Z`);
    const growth = 0.6 + (i / DATA_DAYS) * 0.8;
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6 ? 1.35 : 1;
    const season = [11, 0].includes(d.getUTCMonth()) ? 1.6 : d.getUTCMonth() === 10 ? 1.3 : 1;
    const count = Math.round((3 + rand() * 4) * growth * weekend * season);

    for (let j = 0; j < count; j++) {
      const p = pick(PRODUCTS);
      const qty = rand() < 0.75 ? 1 : rand() < 0.8 ? 2 : 3;
      const r = rand();
      const status: OrderStatus = i > DATA_DAYS - 3 && r < 0.5 ? 'processing' : r < 0.04 ? 'refunded' : 'completed';
      orders.push({
        id: `#${n++}`,
        date,
        customer: `${pick(FIRST)} ${pick(LAST)}`,
        city: pick(CITIES),
        product: p.name,
        category: p.category,
        qty,
        total: p.price * qty,
        status,
      });
    }
  }
  return orders.reverse(); // newest first
}

export const ORDERS = generateOrders();
