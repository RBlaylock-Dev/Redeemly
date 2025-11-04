-- Create post reactions table (likes, hearts, prayers, etc.)
create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction_type text check (reaction_type in ('like', 'heart', 'pray', 'amen')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, user_id, reaction_type)
);

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_anonymous boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create support groups table
create table if not exists public.support_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  group_type text check (group_type in ('recovery', 'bible_study', 'prayer', 'mentorship', 'general')) not null,
  is_private boolean default false,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create group memberships table
create table if not exists public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.support_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text check (role in ('member', 'moderator', 'admin')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(group_id, user_id)
);

-- Enable RLS on all social feature tables
alter table public.post_reactions enable row level security;
alter table public.comments enable row level security;
alter table public.support_groups enable row level security;
alter table public.group_memberships enable row level security;

-- RLS policies for post reactions
create policy "reactions_select_all"
  on public.post_reactions for select
  using (true);

create policy "reactions_insert_own"
  on public.post_reactions for insert
  with check (auth.uid() = user_id);

create policy "reactions_delete_own"
  on public.post_reactions for delete
  using (auth.uid() = user_id);

-- RLS policies for comments
create policy "comments_select_all"
  on public.comments for select
  using (true);

create policy "comments_insert_own"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "comments_update_own"
  on public.comments for update
  using (auth.uid() = author_id);

create policy "comments_delete_own"
  on public.comments for delete
  using (auth.uid() = author_id);

-- RLS policies for support groups
create policy "groups_select_all"
  on public.support_groups for select
  using (true);

create policy "groups_insert_authenticated"
  on public.support_groups for insert
  with check (auth.uid() = created_by);

create policy "groups_update_creator"
  on public.support_groups for update
  using (auth.uid() = created_by);

-- RLS policies for group memberships
create policy "memberships_select_members"
  on public.group_memberships for select
  using (
    exists (
      select 1 from public.group_memberships gm
      where gm.group_id = group_id and gm.user_id = auth.uid()
    ) or auth.uid() = user_id
  );

create policy "memberships_insert_own"
  on public.group_memberships for insert
  with check (auth.uid() = user_id);

create policy "memberships_delete_own"
  on public.group_memberships for delete
  using (auth.uid() = user_id);
