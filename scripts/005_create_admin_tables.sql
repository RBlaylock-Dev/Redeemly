-- Create admin roles and permissions
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'moderator')),
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table for downloadable content
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('bible_study', 'testimony', 'guide', 'book', 'audio', 'video', 'other')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  author_location TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bible studies table
CREATE TABLE IF NOT EXISTS bible_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  scripture_references TEXT[],
  lesson_number INTEGER,
  series_name TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER, -- in minutes
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create website content table for editable page content
CREATE TABLE IF NOT EXISTS website_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  section_key TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'html', 'markdown', 'json')),
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

-- Enable Row Level Security
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Admin roles policies
CREATE POLICY "Admin roles viewable by admins" ON admin_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin roles" ON admin_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

-- Resources policies
CREATE POLICY "Published resources viewable by all" ON resources
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage resources" ON resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Testimonials policies
CREATE POLICY "Published testimonials viewable by all" ON testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Bible studies policies
CREATE POLICY "Published bible studies viewable by all" ON bible_studies
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage bible studies" ON bible_studies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Website content policies
CREATE POLICY "Published content viewable by all" ON website_content
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage website content" ON website_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role IN ('super_admin', 'content_admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_bible_studies_published ON bible_studies(is_published);
CREATE INDEX IF NOT EXISTS idx_website_content_page_slug ON website_content(page_slug);

-- Insert some initial website content
INSERT INTO website_content (page_slug, section_key, content_type, content) VALUES
('home', 'hero_title', 'text', 'Finding Hope and Healing in Christ'),
('home', 'hero_subtitle', 'text', 'A supportive community for those who have walked away from the LGBT lifestyle and found new life in Jesus Christ'),
('about', 'mission_statement', 'html', '<p>Our mission is to provide hope, support, and biblical guidance to those seeking to align their lives with God''s design for sexuality and relationships.</p>'),
('resources', 'page_description', 'text', 'Discover helpful resources, testimonials, and Bible studies to support your journey of faith and transformation.')
ON CONFLICT (page_slug, section_key) DO NOTHING;
