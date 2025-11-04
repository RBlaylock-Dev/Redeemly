-- Add your first super admin
-- Replace 'your-email@example.com' with your actual email address

INSERT INTO admin_roles (user_id, role, granted_at)
SELECT 
  id,
  'super_admin',
  NOW()
FROM auth.users
WHERE email = 'rblaylock286@gmail.com'
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin';

-- Verify the admin was added
SELECT 
  u.email,
  ar.role,
  ar.granted_at
FROM admin_roles ar
JOIN auth.users u ON u.id = ar.user_id
WHERE u.email = 'rblaylock286@gmail.com';
