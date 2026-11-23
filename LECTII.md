# Insights — Lecții (în română)

Proiectul 8: un dashboard de vânzări — exact genul de aplicație internă pe care o fac multe firme.

## Lecția 1 — Date demo „deterministe”
Nu avem un magazin real, deci **generăm** comenzi (`data/generateOrders.ts`). Folosim un generator aleator **cu seed** (`mulberry32`): același seed → aceleași date, la fiecare build.
De ce contează? Pagina e generată static (HTML) și apoi „hidratată” în browser. Dacă datele ar fi diferite, React ar da eroare de hidratare.
Am adăugat realism: creștere în timp, mai multe comenzi în weekend, vârf în noiembrie–decembrie.

**Exercițiu:** adaugă o „campanie” de Black Friday: în ultima vineri din noiembrie, de 3 ori mai multe comenzi.

## Lecția 2 — Agregări (ca în SQL)
`lib/analytics.ts` = interogări SQL scrise în TypeScript:
- `WHERE` → `filter` (intervalul de date, fără comenzile rambursate)
- `GROUP BY` → un `Map` cu cheia = zi / săptămână / lună
- `SUM`, `COUNT`, `AVG` → `reduce`
Compară cu `sql/queries.sql`. Atenție la **golurile** din grafic: o zi fără comenzi trebuie să apară cu 0 (în SQL: `generate_series`).

**Exercițiu:** scrie `byCity(orders)` (venit pe oraș) și varianta SQL.

## Lecția 3 — Recharts
- `ResponsiveContainer` — graficul se adaptează la lățime
- `AreaChart` + `linearGradient` — zona colorată sub linie
- `Tooltip content={...}` — tooltip propriu, stilizat cu Tailwind
- Culorile vin din `useChartColors()` pentru că Recharts are nevoie de valori reale (nu clase Tailwind)

**Exercițiu:** adaugă în `RevenueChart` a doua linie: numărul de comenzi (pe o axă Y din dreapta).

## Lecția 4 — TanStack Table
E un tabel „headless”: îți dă **logica** (sortare, filtrare, paginare), tu scrii HTML-ul.
- `columns.tsx` — definești coloanele cu `createColumnHelper`
- `getSortedRowModel`, `getFilteredRowModel`, `getPaginationRowModel` — activezi funcțiile
- `state: { sorting, globalFilter, columnFilters }` — tu controlezi starea
Exportul CSV folosește rândurile **filtrate**, nu toate.

**Exercițiu:** adaugă un selector „rânduri pe pagină” (10 / 25 / 50) cu `table.setPageSize`.

## Lecția 5 — Dark mode cu View Transitions
1. Tailwind 4: `@custom-variant dark (&:where(.dark, .dark *));` → clasele `dark:` funcționează când `<html>` are clasa `dark`.
2. `document.startViewTransition()` face o „poză” a paginii vechi și una a celei noi.
3. Animăm `clip-path: circle()` pe pagina nouă, pornind din punctul unde ai dat click.
Dacă browserul nu suportă API-ul, schimbarea e instantanee (progressive enhancement).

**Exercițiu:** fă cercul să pornească mereu din colțul dreapta-sus.

## Lecția 6 — Performanță: memoizare și animații fără re-render
- `useMemo` în `useDashboardData` → calculele grele rulează doar când se schimbă intervalul
- `AnimatedNumber` scrie direct în DOM (`el.textContent`) în timpul animației → nu re-randăm React de 60 de ori pe secundă
- `useDebounced` la căutare → filtrăm după ce utilizatorul se oprește din scris

**Exercițiu:** adaugă `console.count('compute')` în `useDashboardData` și verifică de câte ori rulează când treci prin pagini.
