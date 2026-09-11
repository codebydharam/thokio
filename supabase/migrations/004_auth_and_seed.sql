-- Create a customer profile whenever Supabase Auth creates a user.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, user_role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), 'CUSTOMER')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.categories (name, slug, sort_order) values
  ('Handloom textiles', 'handloom-textiles', 1),
  ('Rugs & mats', 'rugs-mats', 2),
  ('Metal craft', 'metal-craft', 3),
  ('Home & lifestyle', 'home-lifestyle', 4),
  ('Fashion accessories', 'fashion-accessories', 5),
  ('Agro-commodities', 'agro-commodities', 6)
on conflict (slug) do nothing;

insert into public.coupons (code, discount_type, discount_value, minimum_order, expires_at)
values ('WELCOME10', 'PERCENT', 10, 999, now() + interval '90 days')
on conflict (code) do nothing;
