-- ThokIO marketplace expansion. Run after 001 and 002.
create type public.user_role as enum ('SUPER_ADMIN', 'ADMIN', 'VENDOR', 'CUSTOMER');
create type public.product_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
create type public.order_payment_status as enum ('PENDING', 'AUTHORIZED', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED');
create type public.fulfillment_status as enum ('PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED');
create type public.discount_type as enum ('PERCENT', 'FIXED');
create type public.return_status as enum ('REQUESTED', 'APPROVED', 'PICKED_UP', 'REFUNDED', 'REJECTED');

alter table public.profiles add column if not exists user_role public.user_role not null default 'CUSTOMER';
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists is_verified boolean not null default false;
alter table public.products add column if not exists brand text;
alter table public.products add column if not exists status public.product_status not null default 'DRAFT';
alter table public.products add column if not exists retail_price numeric(12,2) not null default 0;
alter table public.products add column if not exists wholesale_price numeric(12,2) not null default 0;
alter table public.products add column if not exists seo_slug text;
alter table public.products add column if not exists tags text[] not null default '{}';
alter table public.products add column if not exists attributes jsonb not null default '{}'::jsonb;
alter table public.products add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  name text not null,
  attributes jsonb not null default '{}'::jsonb,
  retail_price numeric(12,2) not null check (retail_price >= 0),
  wholesale_price numeric(12,2) not null check (wholesale_price >= 0),
  compare_at_price numeric(12,2),
  weight_grams integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null unique references public.product_variants(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  reorder_level integer not null default 5,
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'IN',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or session_id is not null)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id),
  quantity integer not null check (quantity > 0),
  unique (cart_id, variant_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type public.discount_type not null,
  discount_value numeric(12,2) not null check (discount_value >= 0),
  minimum_order numeric(12,2) not null default 0,
  maximum_discount numeric(12,2),
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true
);

create table if not exists public.orders_v2 (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('THK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_id uuid not null references public.profiles(id),
  shipping_address jsonb not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  shipping_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  payment_provider text,
  payment_status public.order_payment_status not null default 'PENDING',
  fulfillment_status public.fulfillment_status not null default 'PENDING',
  tracking_number text,
  coupon_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders_v2(id) on delete cascade,
  vendor_id uuid not null references public.profiles(id),
  variant_id uuid not null references public.product_variants(id),
  product_title text not null,
  variant_name text not null,
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid not null references public.profiles(id),
  order_id uuid references public.orders_v2(id),
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, customer_id, order_id)
);

create table if not exists public.returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders_v2(id),
  customer_id uuid not null references public.profiles(id),
  reason text not null,
  status public.return_status not null default 'REQUESTED',
  refund_amount numeric(12,2),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists products_status_category_idx on public.products(status, category);
create index if not exists product_variants_product_idx on public.product_variants(product_id);
create index if not exists inventory_low_stock_idx on public.inventory(quantity, reorder_level);
create index if not exists orders_v2_customer_idx on public.orders_v2(customer_id, created_at desc);
create index if not exists orders_v2_status_idx on public.orders_v2(fulfillment_status, created_at desc);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlists enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.coupons enable row level security;
alter table public.orders_v2 enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.returns enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "Active categories are public" on public.categories for select using (is_active = true);
create policy "Active brands are public" on public.brands for select using (is_active = true);
create policy "Published variants are public" on public.product_variants for select using (is_active = true and exists (select 1 from public.products p where p.id = product_id and p.status = 'PUBLISHED'));
create policy "Customers manage their addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers manage their wishlist" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers manage their carts" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers manage cart items" on public.cart_items for all using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())) with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "Customers view their orders" on public.orders_v2 for select using (auth.uid() = customer_id);
create policy "Customers view their order items" on public.order_items for select using (exists (select 1 from public.orders_v2 o where o.id = order_id and o.customer_id = auth.uid()));
create policy "Customers create orders" on public.orders_v2 for insert with check (auth.uid() = customer_id);
create policy "Approved reviews are public" on public.reviews for select using (is_approved = true);
create policy "Customers manage own reviews" on public.reviews for insert with check (auth.uid() = customer_id);
create policy "Customers view own returns" on public.returns for select using (auth.uid() = customer_id);
create policy "Users view own notifications" on public.notifications for select using (auth.uid() = user_id);

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from profiles where id = auth.uid() and user_role in ('SUPER_ADMIN', 'ADMIN')); $$;
create or replace function public.is_vendor() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from profiles where id = auth.uid() and user_role = 'VENDOR'); $$;
create policy "Staff manage marketplace" on public.products for all using (public.is_staff() or supplier_id = auth.uid()) with check (public.is_staff() or supplier_id = auth.uid());
create policy "Staff manage inventory" on public.inventory for all using (public.is_staff() or exists (select 1 from product_variants v join products p on p.id = v.product_id where v.id = variant_id and p.supplier_id = auth.uid())) with check (public.is_staff() or exists (select 1 from product_variants v join products p on p.id = v.product_id where v.id = variant_id and p.supplier_id = auth.uid()));

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
create policy "Public product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Vendors upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and (public.is_vendor() or public.is_staff()));
create policy "Public avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users upload own avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

alter publication supabase_realtime add table public.orders_v2;
alter publication supabase_realtime add table public.notifications;
