alter table public.products
  add column if not exists slug text,
  add column if not exists cluster text not null default '',
  add column if not exists moq integer not null default 1 check (moq > 0),
  add column if not exists base_price numeric(12,2) not null default 0 check (base_price >= 0),
  add column if not exists gst_rate numeric(5,2) not null default 0 check (gst_rate >= 0),
  add column if not exists lead_time text not null default '7-10 days',
  add column if not exists catalog_source text not null default 'ThokIO verified',
  add column if not exists rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5);

update public.products
set slug = coalesce(nullif(slug, ''), lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')))
where slug is null or slug = '';

create unique index if not exists products_slug_idx on public.products(slug);
create index if not exists products_published_category_idx on public.products(is_published, category);
