-- Create profiles table for user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  location text,
  journey_stage text check (journey_stage in ('questioning', 'beginning', 'progressing', 'established', 'mentor')),
  is_mentor boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "profiles_select_all"
  on public.profiles for select
  using (true); -- Allow all users to view profiles for community features

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, journey_stage)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', 'New Member'),
    'questioning'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for auto-creating profiles
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
