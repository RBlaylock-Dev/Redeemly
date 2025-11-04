-- Create admin roles table with three tiers of access
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'moderator')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create resources table for managing downloadable resources
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('biblical_study', 'testimony', 'healing', 'practical_tools', 'recovery')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'audio', 'pdf', 'book', 'course')),
  url TEXT,
  file_url TEXT,
  author TEXT,
  duration TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials table for managing user testimonies
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  story TEXT NOT NULL,
  journey_stage TEXT CHECK (journey_stage IN ('questioning', 'early_journey', 'growing', 'established', 'mentoring')),
  years_in_faith INTEGER,
  location TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bible studies table for managing study content
CREATE TABLE IF NOT EXISTS bible_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('identity', 'freedom', 'healing', 'relationships', 'purpose', 'renewal')),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  scripture_references TEXT[],
  content TEXT NOT NULL,
  study_guide TEXT,
  discussion_questions TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create website content table for managing editable page content
CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_role ON admin_roles(role);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_bible_studies_category ON bible_studies(category);
CREATE INDEX IF NOT EXISTS idx_bible_studies_published ON bible_studies(is_published);

-- Enable Row Level Security on all admin tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Admin Roles Policies
-- Only super_admins can view and manage admin roles
CREATE POLICY "Super admins can view all admin roles"
  ON admin_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can insert admin roles"
  ON admin_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete admin roles"
  ON admin_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

-- Resources Policies
-- Content admins and super admins can manage resources
CREATE POLICY "Admins can view resources"
  ON resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Admins can insert resources"
  ON resources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Admins can update resources"
  ON resources FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Admins can delete resources"
  ON resources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Public can view published resources
CREATE POLICY "Public can view featured resources"
  ON resources FOR SELECT
  USING (is_featured = true);

-- Testimonials Policies
-- All admins can view testimonials
CREATE POLICY "Admins can view testimonials"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid()
    )
  );

-- Content admins and super admins can manage testimonials
CREATE POLICY "Content admins can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Content admins can update testimonials"
  ON testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Content admins can delete testimonials"
  ON testimonials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Public can view approved testimonials
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = true);

-- Bible Studies Policies
-- Content admins and super admins can manage bible studies
CREATE POLICY "Admins can view bible studies"
  ON bible_studies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Admins can insert bible studies"
  ON bible_studies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Admins can update bible studies"
  ON bible_studies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Admins can delete bible studies"
  ON bible_studies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Public can view published bible studies
CREATE POLICY "Public can view published bible studies"
  ON bible_studies FOR SELECT
  USING (is_published = true);

-- Website Content Policies
-- Content admins and super admins can manage website content
CREATE POLICY "Admins can view website content"
  ON website_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

CREATE POLICY "Admins can update website content"
  ON website_content FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() 
      AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Public can view website content
CREATE POLICY "Public can view website content"
  ON website_content FOR SELECT
  USING (true);

-- Create function to check admin role
CREATE OR REPLACE FUNCTION is_admin(check_role TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  IF check_role IS NULL THEN
    -- Check if user has any admin role
    RETURN EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id = auth.uid()
    );
  ELSE
    -- Check if user has specific role
    RETURN EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id = auth.uid() AND role = check_role
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial website content sections
INSERT INTO website_content (page_section, content) VALUES
  ('hero', '{"title": "Redemption has a community", "subtitle": "Find hope, healing, and support on your journey toward Christ"}'),
  ('about', '{"title": "Our Mission", "description": "Supporting those walking away from LGBT lifestyle toward a Christ-centered life"}')
ON CONFLICT (page_section) DO NOTHING;
