-- Simple script to add the first super admin
-- Replace YOUR_USER_ID with your actual user ID from the profiles table

-- First, let's see all users (run this to find your user_id)
SELECT id, display_name, bio FROM profiles;

-- Once you have your user_id, uncomment and run this line:
-- INSERT INTO admin_roles (user_id, role, granted_at)
-- VALUES ('YOUR_USER_ID', 'super_admin', NOW())
-- ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- Example: If your user_id is 71b95f77-8fe5-4717-aaae-5a99a8b84fdc, run:
INSERT INTO admin_roles (user_id, role, granted_at)
VALUES ('71b95f77-8fe5-4717-aaae-5a99a8b84fdc', 'super_admin', NOW())
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
