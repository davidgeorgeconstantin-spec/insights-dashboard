-- PostgreSQL schema for the same data (e.g. Supabase free tier)
create table orders (
  id         text primary key,
  created_on date not null,
  customer   text not null,
  city       text not null,
  product    text not null,
  category   text not null,
  qty        int  not null check (qty > 0),
  total      numeric(10,2) not null,
  status     text not null check (status in ('completed', 'processing', 'refunded'))
);
create index orders_created_on_idx on orders (created_on);
