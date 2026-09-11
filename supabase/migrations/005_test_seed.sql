-- Local/staging demo data. Do not run this migration in production.
-- Safe to rerun because all records use stable IDs and conflict guards.

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo.customer@thokio.local', crypt('DemoCustomer123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Aarav Mehta"}'::jsonb),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo.vendor@thokio.local', crypt('DemoVendor123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Kashi Weaves Collective"}'::jsonb),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo.admin@thokio.local', crypt('DemoAdmin123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"ThokIO Admin"}'::jsonb)
on conflict (id) do nothing;

insert into public.profiles (id, full_name, company_name, gstin, role, user_role, phone, address, is_verified)
values
  ('00000000-0000-0000-0000-000000000101', 'Aarav Mehta', 'Aarav Retail', '09AARPM1234A1Z5', 'BUYER', 'CUSTOMER', '+919876543210', '{"city":"New Delhi","state":"Delhi","postal_code":"110001"}'::jsonb, true),
  ('00000000-0000-0000-0000-000000000102', 'Kashi Weaves Collective', 'Kashi Weaves Collective', '09KASHI1234A1Z5', 'SUPPLIER', 'VENDOR', '+919876543211', '{"city":"Varanasi","state":"Uttar Pradesh","postal_code":"221001"}'::jsonb, true),
  ('00000000-0000-0000-0000-000000000103', 'ThokIO Admin', 'ThokIO Technologies', '09THOKI1234A1Z5', 'ADMIN', 'ADMIN', '+919876543212', '{"city":"Lucknow","state":"Uttar Pradesh","postal_code":"226001"}'::jsonb, true)
on conflict (id) do update set user_role = excluded.user_role, role = excluded.role, is_verified = excluded.is_verified;

insert into public.categories (id, name, slug, sort_order) values
  ('00000000-0000-0000-0000-000000000201', 'Handloom textiles', 'handloom-textiles', 1),
  ('00000000-0000-0000-0000-000000000202', 'Rugs & mats', 'rugs-mats', 2),
  ('00000000-0000-0000-0000-000000000203', 'Metal craft', 'metal-craft', 3)
on conflict (id) do nothing;

insert into public.brands (id, name, slug, logo_url) values
  ('00000000-0000-0000-0000-000000000301', 'Kashi Weaves', 'kashi-weaves', null),
  ('00000000-0000-0000-0000-000000000302', 'Bhadohi Loom House', 'b ladohi-loom-house', null)
on conflict (id) do nothing;

insert into public.products (id, slug, title, description, category, hsn_code, images, tier_pricing, supplier_id, is_published, cluster, moq, base_price, gst_rate, lead_time, catalog_source, rating, brand, status, retail_price, wholesale_price, seo_slug)
values
  ('00000000-0000-0000-0000-000000000401', 'banarasi-silk-stoles', 'Banarasi silk stoles', 'Handloom silk stoles with zari accents for boutiques and gifting.', 'Handloom textiles', '6214', array['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'], '[{"min_qty":25,"unit_price":680},{"min_qty":100,"unit_price":610}]'::jsonb, '00000000-0000-0000-0000-000000000102', true, 'Varanasi, UP', 25, 680, 5, '7-10 days', 'ThokIO verified', 4.9, 'Kashi Weaves', 'PUBLISHED', 899, 680, 'banarasi-silk-stoles'),
  ('00000000-0000-0000-0000-000000000402', 'cotton-rugs', 'Hand-knotted cotton rugs', 'Washable flat-weave cotton rugs in warm neutrals.', 'Rugs & mats', '5705', array['https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85'], '[{"min_qty":20,"unit_price":1240},{"min_qty":100,"unit_price":1090}]'::jsonb, '00000000-0000-0000-0000-000000000102', true, 'Bhadohi, UP', 20, 1240, 5, '12-15 days', 'IndiaMART API', 4.8, 'Bhadohi Loom House', 'PUBLISHED', 1599, 1240, 'cotton-rugs')
on conflict (id) do nothing;

insert into public.product_variants (id, product_id, sku, name, attributes, retail_price, wholesale_price, weight_grams)
values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'KW-STOLE-BLU', 'Indigo / One size', '{"color":"Indigo","size":"One size"}'::jsonb, 899, 680, 180),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000402', 'BL-RUG-NAT', 'Natural / 4x6 ft', '{"color":"Natural","size":"4x6 ft"}'::jsonb, 1599, 1240, 1800)
on conflict (id) do nothing;

insert into public.inventory (variant_id, quantity, reserved_quantity, reorder_level)
values
  ('00000000-0000-0000-0000-000000000501', 240, 12, 25),
  ('00000000-0000-0000-0000-000000000502', 64, 8, 10)
on conflict (variant_id) do update set quantity = excluded.quantity, reserved_quantity = excluded.reserved_quantity;

insert into public.addresses (id, user_id, label, full_name, phone, line1, city, state, postal_code, is_default)
values ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000101', 'Office', 'Aarav Mehta', '+919876543210', '14 Connaught Place', 'New Delhi', 'Delhi', '110001', true)
on conflict (id) do nothing;

insert into public.wishlists (user_id, product_id)
values ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401')
on conflict do nothing;

insert into public.carts (id, user_id)
values ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000101')
on conflict (id) do nothing;
insert into public.cart_items (cart_id, variant_id, quantity)
values ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000501', 5)
on conflict (cart_id, variant_id) do update set quantity = excluded.quantity;

insert into public.coupons (id, code, discount_type, discount_value, minimum_order, expires_at)
values ('00000000-0000-0000-0000-000000000801', 'DEMO10', 'PERCENT', 10, 500, now() + interval '90 days')
on conflict (id) do nothing;

insert into public.orders (id, lead_id, buyer_id, supplier_id, total_amount, advance_amount_paid, balance_amount_due, status)
values ('00000000-0000-0000-0000-000000000901', null, '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000102', 3400, 1020, 2380, 'SUPPLIER_NOTIFIED')
on conflict (id) do nothing;

insert into public.payments (id, order_id, payment_gateway_id, amount, payment_type, status)
values ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000901', 'demo_razorpay_payment_001', 1020, '30_PERCENT_ADVANCE', 'SUCCESS')
on conflict (id) do nothing;

insert into public.orders_v2 (id, order_number, customer_id, shipping_address, subtotal, discount_amount, tax_amount, shipping_amount, total_amount, payment_provider, payment_status, fulfillment_status, coupon_code)
values ('00000000-0000-0000-0000-000000001101', 'THK-DEMO-1001', '00000000-0000-0000-0000-000000000101', '{"full_name":"Aarav Mehta","line1":"14 Connaught Place","city":"New Delhi","state":"Delhi","postal_code":"110001","country":"IN"}'::jsonb, 3400, 340, 153, 0, 3213, 'razorpay', 'PAID', 'SHIPPED', 'DEMO10')
on conflict (id) do nothing;

insert into public.order_items (id, order_id, vendor_id, variant_id, product_title, variant_name, unit_price, quantity, line_total)
values ('00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000501', 'Banarasi silk stoles', 'Indigo / One size', 680, 5, 3400)
on conflict (id) do nothing;

insert into public.reviews (id, product_id, customer_id, order_id, rating, title, body, is_approved)
values ('00000000-0000-0000-0000-000000001301', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000001101', 5, 'Excellent finish', 'The zari work and packaging were both excellent.', true)
on conflict (id) do nothing;

insert into public.returns (id, order_id, customer_id, reason, status, refund_amount)
values ('00000000-0000-0000-0000-000000001401', '00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000101', 'Demo return request', 'REQUESTED', 680)
on conflict (id) do nothing;

insert into public.notifications (id, user_id, title, body, href)
values ('00000000-0000-0000-0000-000000001501', '00000000-0000-0000-0000-000000000101', 'Order shipped', 'Your demo order THK-DEMO-1001 has shipped.', '/buyer/dashboard')
on conflict (id) do nothing;

insert into public.audit_logs (id, actor_id, action, entity_type, entity_id, payload)
values ('00000000-0000-0000-0000-000000001601', '00000000-0000-0000-0000-000000000103', 'SEED_DEMO_DATA', 'orders_v2', '00000000-0000-0000-0000-000000001101', '{"source":"005_test_seed"}'::jsonb)
on conflict (id) do nothing;
