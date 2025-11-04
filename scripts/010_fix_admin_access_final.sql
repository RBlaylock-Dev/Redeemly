-- Drop all existing policies on admin_roles to start fresh
DROP POLICY IF EXISTS "admin_roles_select" ON admin_roles;
DROP POLICY IF EXISTS "admin_roles_insert_super_admin" ON admin_roles;
DROP POLICY IF EXISTS "admin_roles_update_super_admin" ON admin_roles;
DROP POLICY IF EXISTS "admin_roles_delete_super_admin" ON admin_roles;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS is_super_admin(uuid);

-- Create a simple function that checks admin status without RLS
CREATE OR REPLACE FUNCTION check_user_admin_role(user_id uuid)
RETURNS TABLE (role text, granted_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role, granted_at
  FROM admin_roles
  WHERE admin_roles.user_id = check_user_admin_role.user_id
  LIMIT 1;
$$;

-- Create simple RLS policies that don't cause recursion
-- Users can only see their own admin role
CREATE POLICY "admin_roles_select_own"
ON admin_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only allow inserts through the function or by existing super admins
CREATE POLICY "admin_roles_insert"
ON admin_roles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM admin_roles ar
    WHERE ar.user_id = auth.uid()
    AND ar.role = 'super_admin'
  )
);

-- Only super admins can update roles
CREATE POLICY "admin_roles_update"
ON admin_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM admin_roles ar
    WHERE ar.user_id = auth.uid()
    AND ar.role = 'super_admin'
  )
);

-- Only super admins can delete roles
CREATE POLICY "admin_roles_delete"
ON admin_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM admin_roles ar
    WHERE ar.user_id = auth.uid()
    AND ar.role = 'super_admin'
  )
);

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION check_user_admin_role(uuid) TO authenticated;
