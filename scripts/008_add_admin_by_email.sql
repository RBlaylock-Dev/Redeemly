-- Add yourself as super admin by email
-- Replace 'YOUR_EMAIL_HERE' with the email you used to sign up

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID from auth.users based on email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'YOUR_EMAIL_HERE';  -- REPLACE THIS WITH YOUR EMAIL

  -- Check if user was found
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email YOUR_EMAIL_HERE not found. Please sign up first.';
  END IF;

  -- Insert or update admin role
  INSERT INTO admin_roles (user_id, role, granted_by)
  VALUES (v_user_id, 'super_admin', v_user_id)
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'super_admin', granted_at = NOW();

  RAISE NOTICE 'Successfully granted super_admin role to user %', v_user_id;
END $$;

-- Verify the admin was added
SELECT 
  ar.user_id,
  ar.role,
  ar.granted_at,
  au.email
FROM admin_roles ar
JOIN auth.users au ON ar.user_id = au.id
WHERE au.email = 'YOUR_EMAIL_HERE';  -- REPLACE THIS WITH YOUR EMAIL
