-- KisanJunction hackathon schema. See README security notes before public use.
create extension if not exists pgcrypto;
create table if not exists public.users (
 id uuid primary key default gen_random_uuid(), full_name text not null,
 phone text not null unique, role text not null check (role in ('farmer','buyer','driver')),
 location text not null, created_at timestamptz not null default now()
);
create table if not exists public.listings (
 id uuid primary key default gen_random_uuid(), farmer_id uuid references public.users(id),
 crop_name text not null, quantity_kg numeric not null check (quantity_kg > 0),
 price_per_kg numeric not null check (price_per_kg > 0), location text not null,
 status text not null default 'available' check (status in ('available','sold')),
 created_at timestamptz not null default now()
);
create table if not exists public.deliveries (
 id uuid primary key default gen_random_uuid(), listing_id uuid references public.listings(id),
 driver_id uuid references public.users(id), pickup_location text, drop_location text,
 status text not null default 'pending' check (status in ('pending','in_transit','delivered')),
 created_at timestamptz not null default now()
);
create index if not exists listings_status_created_idx on public.listings(status, created_at desc);
create index if not exists deliveries_status_created_idx on public.deliveries(status, created_at desc);
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.deliveries enable row level security;
-- Demo read access: farmer contact details are public. Do not use with real private data.
drop policy if exists "Demo read users" on public.users;
create policy "Demo read users" on public.users for select to anon, authenticated using (true);
drop policy if exists "Demo read listings" on public.listings;
create policy "Demo read listings" on public.listings for select to anon, authenticated using (true);
drop policy if exists "Demo read deliveries" on public.deliveries;
create policy "Demo read deliveries" on public.deliveries for select to anon, authenticated using (true);
grant select on public.users, public.listings, public.deliveries to anon, authenticated;
-- A single transaction creates all three records, avoiding orphan listings.
create or replace function public.create_farm_listing(p_full_name text, p_phone text, p_crop_name text, p_quantity_kg numeric, p_price_per_kg numeric, p_location text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_farmer uuid; v_listing uuid;
begin
 if nullif(trim(p_full_name),'') is null or nullif(trim(p_phone),'') is null or nullif(trim(p_crop_name),'') is null or nullif(trim(p_location),'') is null or p_quantity_kg is null or p_quantity_kg <= 0 or p_price_per_kg is null or p_price_per_kg <= 0 then raise exception 'Please provide valid listing details'; end if;
 insert into public.users(full_name,phone,role,location) values(trim(p_full_name),trim(p_phone),'farmer',trim(p_location)) on conflict (phone) do nothing;
 select id into v_farmer from public.users where phone=trim(p_phone) and role='farmer';
 if v_farmer is null then raise exception 'This phone number belongs to another role'; end if;
 insert into public.listings(farmer_id,crop_name,quantity_kg,price_per_kg,location) values(v_farmer,trim(p_crop_name),p_quantity_kg,p_price_per_kg,trim(p_location)) returning id into v_listing;
 insert into public.deliveries(listing_id,pickup_location) values(v_listing,trim(p_location));
 return v_listing;
end $$;
create or replace function public.mark_listing_sold(p_listing_id uuid) returns boolean language plpgsql security definer set search_path = public as $$
begin update public.listings set status='sold' where id=p_listing_id and status='available'; return found; end $$;
create or replace function public.accept_delivery(p_delivery_id uuid) returns boolean language plpgsql security definer set search_path = public as $$
begin update public.deliveries set status='in_transit' where id=p_delivery_id and status='pending'; return found; end $$;
revoke all on function public.create_farm_listing(text,text,text,numeric,numeric,text) from public;
revoke all on function public.mark_listing_sold(uuid) from public;
revoke all on function public.accept_delivery(uuid) from public;
grant execute on function public.create_farm_listing(text,text,text,numeric,numeric,text), public.mark_listing_sold(uuid), public.accept_delivery(uuid) to anon, authenticated;
