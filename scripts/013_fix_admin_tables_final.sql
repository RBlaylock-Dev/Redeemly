-- Drop all existing policies on admin tables to start fresh
DROP POLICY IF EXISTS "resources_select_all" ON resources;
DROP POLICY IF EXISTS "resources_insert_admin" ON resources;
DROP POLICY IF EXISTS "resources_update_admin" ON resources;
DROP POLICY IF EXISTS "resources_delete_admin" ON resources;

DROP POLICY IF EXISTS "testimonials_select_all" ON testimonials;
DROP POLICY IF EXISTS "testimonials_insert_admin" ON testimonials;
DROP POLICY IF EXISTS "testimonials_update_admin" ON testimonials;
DROP POLICY IF EXISTS "testimonials_delete_admin" ON testimonials;

DROP POLICY IF EXISTS "bible_studies_select_all" ON bible_studies;
DROP POLICY IF EXISTS "bible_studies_insert_admin" ON bible_studies;
DROP POLICY IF EXISTS "bible_studies_update_admin" ON bible_studies;
DROP POLICY IF EXISTS "bible_studies_delete_admin" ON bible_studies;

-- Create simple, non-recursive policies for resources
CREATE POLICY "resources_select_all" ON resources
  FOR SELECT USING (
    is_featured = true 
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "resources_insert_admin" ON resources
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "resources_update_admin" ON resources
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "resources_delete_admin" ON resources
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

-- Create simple, non-recursive policies for testimonials
CREATE POLICY "testimonials_select_all" ON testimonials
  FOR SELECT USING (
    is_approved = true 
    OR submitted_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "testimonials_insert_admin" ON testimonials
  FOR INSERT WITH CHECK (
    submitted_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "testimonials_update_admin" ON testimonials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "testimonials_delete_admin" ON testimonials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

-- Create simple, non-recursive policies for bible_studies
CREATE POLICY "bible_studies_select_all" ON bible_studies
  FOR SELECT USING (
    is_published = true 
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "bible_studies_insert_admin" ON bible_studies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "bible_studies_update_admin" ON bible_studies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "bible_studies_delete_admin" ON bible_studies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
      LIMIT 1
    )
  );
