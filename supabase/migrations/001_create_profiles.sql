-- ============================================================
-- Migration: 001_create_profiles
-- Description: Create public.profiles table with RLS + trigger
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  display_name text       not null default '',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'User profile data linked to auth.users.';

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. RLS Policies

-- SELECT: authenticated users can only view their own profile
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

-- INSERT: authenticated users can only insert their own profile
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- UPDATE: authenticated users can only update their own profile
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- DELETE: authenticated users can only delete their own profile
create policy "profiles_delete_own"
  on public.profiles
  for delete
  to authenticated
  using ((select auth.uid()) = id);

-- 4. Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- 5. Auto-create profile row when a new user signs up
-- Uses security definer so it can write despite RLS.
-- search_path='' prevents search path injection.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

-- Drop trigger first to allow re-running this migration safely
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
