-- Add yourself as a super admin
-- Replace 'your-email@example.com' with your actual email address

-- First, find your user ID from the auth.users table
-- Then insert a record into admin_roles

-- Option 1: If you know your user_id, use this:
-- INSERT INTO admin_roles (user_id, role, granted_by)
-- VALUES ('YOUR-USER-ID-HERE', 'super_admin', 'YOUR-USER-ID-HERE');

-- Option 2: Use your email to automatically find and set yourself as super admin
INSERT INTO admin_roles (user_id, role, granted_by)
SELECT 
  p.id,
  'super_admin',
  p.id
FROM profiles p
INNER JOIN auth.users u ON u.id = p.id
WHERE u.email = 'rblaylock286@gmail.com'
ON CONFLICT DO NOTHING;

-- Verify the admin role was added
SELECT 
  p.display_name,
  p.email,
  ar.role,
  ar.granted_at
FROM admin_roles ar
JOIN profiles p ON p.id = ar.user_id
WHERE ar.role = 'super_admin';
