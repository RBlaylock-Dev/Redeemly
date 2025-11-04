-- Create posts table for community sharing
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  content text not null,
  post_type text check (post_type in ('testimony', 'prayer_request', 'encouragement', 'question', 'resource')) default 'encouragement',
  is_anonymous boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- RLS policies for posts
create policy "posts_select_all"
  on public.posts for select
  using (true); -- Allow all authenticated users to view posts

create policy "posts_insert_own"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "posts_update_own"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "posts_delete_own"
  on public.posts for delete
  using (auth.uid() = author_id);
