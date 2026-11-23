-- The SQL versions of src/lib/analytics.ts

-- KPIs for a date range (computeKpis)
select sum(total)               as revenue,
       count(*)                 as orders,
       avg(total)               as aov,
       count(distinct customer) as customers
from orders
where created_on between :from and :to
  and status <> 'refunded';

-- Revenue per month (revenueSeries with granularity = 'month')
select date_trunc('month', created_on)::date as month,
       sum(total) as revenue,
       count(*)   as orders
from orders
where created_on between :from and :to and status <> 'refunded'
group by 1
order by 1;

-- Daily series without gaps (generate_series fills empty days with 0)
select d::date as day, coalesce(sum(o.total), 0) as revenue
from generate_series(:from::date, :to::date, interval '1 day') d
left join orders o on o.created_on = d::date and o.status <> 'refunded'
group by 1
order by 1;

-- Top products (topProducts)
select product, sum(total) as revenue, sum(qty) as units
from orders
where created_on between :from and :to and status <> 'refunded'
group by product
order by revenue desc
limit 6;

-- Revenue by category (byCategory)
select category, sum(total) as revenue
from orders
where created_on between :from and :to and status <> 'refunded'
group by category
order by revenue desc;
