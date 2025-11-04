-- Drop the existing recursive policies on admin_roles
DROP POLICY IF EXISTS "Super admins can view all admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Super admins can insert admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Super admins can delete admin roles" ON admin_roles;

-- Create new non-recursive policies for admin_roles
-- Users can view their own admin role (no recursion)
CREATE POLICY "Users can view own admin role"
  ON admin_roles FOR SELECT
  USING (user_id = auth.uid());

-- Create a security definer function to check if user is super admin
-- This function bypasses RLS to avoid recursion
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Super admins can insert new admin roles (using security definer function)
CREATE POLICY "Super admins can insert admin roles"
  ON admin_roles FOR INSERT
  WITH CHECK (auth.is_super_admin());

-- Super admins can delete admin roles (using security definer function)
CREATE POLICY "Super admins can delete admin roles"
  ON admin_roles FOR DELETE
  USING (auth.is_super_admin());

-- Super admins can update admin roles (using security definer function)
CREATE POLICY "Super admins can update admin roles"
  ON admin_roles FOR UPDATE
  USING (auth.is_super_admin());
