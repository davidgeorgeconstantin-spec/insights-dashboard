# Insights — Soluții

## Lecția 1
În `generateOrders`, după `season`:
```ts
const isBlackFriday = d.getUTCMonth() === 10 && d.getUTCDay() === 5 && d.getUTCDate() + 7 > 30;
const promo = isBlackFriday ? 3 : 1;
const count = Math.round((3 + rand() * 4) * growth * weekend * season * promo);
```

## Lecția 2
```ts
export function byCity(orders: Order[]) {
  const map = new Map<string, number>();
  for (const o of orders) if (o.status !== 'refunded') map.set(o.city, (map.get(o.city) ?? 0) + o.total);
  return [...map.entries()].map(([city, revenue]) => ({ city, revenue })).sort((a, b) => b.revenue - a.revenue);
}
```
```sql
select city, sum(total) as revenue
from orders
where created_on between :from and :to and status <> 'refunded'
group by city
order by revenue desc;
```

## Lecția 3
```tsx
<YAxis yAxisId="orders" orientation="right" tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
<Line yAxisId="orders" type="monotone" dataKey="orders" stroke={c.secondary} dot={false} strokeWidth={2} />
```
Pune `yAxisId="left"` pe primul `YAxis` și pe `Area`. Pentru `Line` folosește `ComposedChart` în loc de `AreaChart` (import din `recharts`).

## Lecția 4
```tsx
<select value={table.getState().pagination.pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))} className="rounded-lg border px-2 py-1">
  {[10, 25, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
</select>
```

## Lecția 5
În `ThemeToggle.tsx`: `const x = innerWidth; const y = 0;` (în loc de `e.clientX` / `e.clientY`).

## Lecția 6
Vei vedea că rulează la prima afișare și apoi doar când schimbi intervalul sau gruparea (zi/săptămână/lună) — nu la hover pe grafic sau când tastezi în tabel.
