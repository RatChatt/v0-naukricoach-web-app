-- Add Google OAuth support to user profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';

-- Update existing profiles to have email provider
UPDATE user_profiles SET provider = 'email' WHERE provider IS NULL;

-- Create index for faster provider lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_provider ON user_profiles(provider);

-- Add function to handle new user creation from OAuth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, email, avatar_url, provider)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    email = COALESCE(EXCLUDED.email, user_profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    provider = COALESCE(EXCLUDED.provider, user_profiles.provider),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add some sample Google-authenticated users for testing
INSERT INTO user_profiles (
  id, 
  full_name, 
  email, 
  avatar_url, 
  provider,
  optional_subject,
  home_state,
  educational_background,
  current_affairs_level
) VALUES 
(
  gen_random_uuid(),
  'Priya Sharma',
  'priya.sharma@gmail.com',
  'https://ui-avatars.io/api/?name=Priya+Sharma&background=3b82f6&color=fff',
  'google',
  'Political Science',
  'Maharashtra',
  'MA Political Science from JNU',
  'Advanced'
),
(
  gen_random_uuid(),
  'Rajesh Kumar',
  'rajesh.kumar@gmail.com',
  'https://ui-avatars.io/api/?name=Rajesh+Kumar&background=10b981&color=fff',
  'google',
  'Public Administration',
  'Uttar Pradesh',
  'B.Tech from IIT Kanpur, MBA from IIM Lucknow',
  'Intermediate'
),
(
  gen_random_uuid(),
  'Anita Patel',
  'anita.patel@gmail.com',
  'https://ui-avatars.io/api/?name=Anita+Patel&background=f59e0b&color=fff',
  'google',
  'Economics',
  'Gujarat',
  'MA Economics from Delhi School of Economics',
  'Expert'
)
ON CONFLICT (id) DO NOTHING;
