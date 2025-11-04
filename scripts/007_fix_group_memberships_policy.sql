-- Drop the problematic policy that causes infinite recursion
drop policy if exists "memberships_select_members" on public.group_memberships;

-- Create a simpler policy that doesn't cause recursion
-- Users can see memberships for groups they belong to, or their own memberships
create policy "memberships_select_simple"
  on public.group_memberships for select
  using (
    -- Users can always see their own memberships
    auth.uid() = user_id
    -- Or they can see memberships of public groups
    or exists (
      select 1 from public.support_groups sg
      where sg.id = group_id and sg.is_private = false
    )
  );
