create extension if not exists "pgcrypto";

create type public.profile_role as enum ('BUYER', 'SUPPLIER', 'ADMIN');
create type public.lead_source as enum ('INDIAMART', 'WEBSITE', 'TRADEINDIA');
create type public.lead_status as enum ('NEW', 'QUOTED', 'SAMPLE_ORDERED', 'ADVANCE_PAID', 'DISPATCHED', 'COMPLETED');
create type public.order_status as enum ('ADVANCE_PENDING', 'SUPPLIER_NOTIFIED', 'QC_IN_PROGRESS', 'PACKED', 'SHIPPED', 'DELIVERED');
create type public.payment_type as enum ('SAMPLE_KIT', '30_PERCENT_ADVANCE', '70_PERCENT_BALANCE');
create type public.payment_status as enum ('SUCCESS', 'PENDING', 'FAILED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  company_name text,
  gstin text unique,
  udyam_no text,
  role public.profile_role not null default 'BUYER',
  phone text,
  address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  hsn_code text,
  images text[] not null default '{}',
  tier_pricing jsonb not null default '[]'::jsonb,
  supplier_id uuid not null references public.profiles(id),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  source public.lead_source not null,
  external_lead_id text,
  buyer_name text not null,
  buyer_phone text not null,
  requested_item text not null,
  qty integer not null check (qty > 0),
  status public.lead_status not null default 'NEW',
  created_at timestamptz not null default now(),
  unique (source, external_lead_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id),
  buyer_id uuid not null references public.profiles(id),
  supplier_id uuid not null references public.profiles(id),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  advance_amount_paid numeric(12,2) not null default 0,
  balance_amount_due numeric(12,2) not null default 0,
  status public.order_status not null default 'ADVANCE_PENDING',
  tracking_number text,
  shipping_label_url text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payment_gateway_id text,
  amount numeric(12,2) not null check (amount > 0),
  payment_type public.payment_type not null,
  status public.payment_status not null default 'PENDING',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;

create policy "Published products are public" on public.products for select using (is_published = true);
create policy "Users can view their profile" on public.profiles for select using (auth.uid() = id);
create policy "Buyers can view their orders" on public.orders for select using (auth.uid() = buyer_id);
create index products_category_idx on public.products(category);
create index leads_status_created_idx on public.leads(status, created_at desc);
create index orders_status_created_idx on public.orders(status, created_at desc);
