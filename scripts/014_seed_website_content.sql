-- Seed initial website content sections
INSERT INTO website_content (page_section, content, updated_at) VALUES
  ('home_hero', '{"title": "Welcome to Redeemly", "subtitle": "Redemption has a community", "description": "Find support, resources, and community as you journey toward faith and transformation."}', NOW()),
  ('home_features', '{"features": [{"title": "Community Support", "description": "Connect with others on similar journeys"}, {"title": "Resources", "description": "Access helpful materials and guidance"}, {"title": "Bible Studies", "description": "Grow in faith through structured studies"}]}', NOW()),
  ('about_mission', '{"title": "Our Mission", "content": "Redeemly exists to support individuals transitioning from an LGBT lifestyle to Christianity, providing a safe community and resources for spiritual growth."}', NOW()),
  ('resources_intro', '{"title": "Resources Library", "description": "Explore our collection of articles, videos, and materials to support your journey."}', NOW()),
  ('contact_info', '{"email": "support@redeemly.com", "message": "We are here to support you. Reach out anytime."}', NOW())
ON CONFLICT DO NOTHING;
