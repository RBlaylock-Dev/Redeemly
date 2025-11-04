-- Fix RLS policies for admin content tables to allow admin access
-- This script removes recursive policies and creates simple admin-only policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "resources_select_published" ON resources;
DROP POLICY IF EXISTS "resources_insert_admin" ON resources;
DROP POLICY IF EXISTS "resources_update_admin" ON resources;
DROP POLICY IF EXISTS "resources_delete_admin" ON resources;

DROP POLICY IF EXISTS "testimonials_select_published" ON testimonials;
DROP POLICY IF EXISTS "testimonials_insert_admin" ON testimonials;
DROP POLICY IF EXISTS "testimonials_update_admin" ON testimonials;
DROP POLICY IF EXISTS "testimonials_delete_admin" ON testimonials;

DROP POLICY IF EXISTS "bible_studies_select_published" ON bible_studies;
DROP POLICY IF EXISTS "bible_studies_insert_admin" ON bible_studies;
DROP POLICY IF EXISTS "bible_studies_update_admin" ON bible_studies;
DROP POLICY IF EXISTS "bible_studies_delete_admin" ON bible_studies;

-- Create new simple policies for resources
CREATE POLICY "resources_select_all"
ON resources FOR SELECT
TO authenticated
USING (
  is_featured = true 
  OR 
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
  )
);

CREATE POLICY "resources_insert_admin"
ON resources FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role IN ('super_admin', 'content_admin')
  )
);

CREATE POLICY "resources_update_admin"
ON resources FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role IN ('super_admin', 'content_admin')
  )
);

CREATE POLICY "resources_delete_admin"
ON resources FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role = 'super_admin'
  )
);

-- Create new simple policies for testimonials
CREATE POLICY "testimonials_select_all"
ON testimonials FOR SELECT
TO authenticated
USING (
  is_approved = true 
  OR 
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
  )
);

CREATE POLICY "testimonials_insert_admin"
ON testimonials FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role IN ('super_admin', 'content_admin', 'moderator')
  )
);

CREATE POLICY "testimonials_update_admin"
ON testimonials FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role IN ('super_admin', 'content_admin', 'moderator')
  )
);

CREATE POLICY "testimonials_delete_admin"
ON testimonials FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role IN ('super_admin', 'content_admin')
  )
);

-- Create new simple policies for bible_studies
CREATE POLICY "bible_studies_select_all"
ON bible_studies FOR SELECT
TO authenticated
USING (
  is_published = true 
  OR 
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
  )
);

CREATE POLICY "bible_studies_insert_admin"
ON bible_studies FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role IN ('super_admin', 'content_admin')
  )
);

CREATE POLICY "bible_studies_update_admin"
ON bible_studies FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role IN ('super_admin', 'content_admin')
  )
);

CREATE POLICY "bible_studies_delete_admin"
ON bible_studies FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role = 'super_admin'
  )
);
