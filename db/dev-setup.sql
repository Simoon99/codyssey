-- Dev Mode Setup
-- Run this script to set up demo data for development mode
-- This script is safe to run multiple times

-- Create demo user and profile (if not exists)
DO $$
DECLARE
  demo_user_uuid uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Insert demo user into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = demo_user_uuid) THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      demo_user_uuid,
      'demo@vibecoding.com',
      '$2a$10$demo.hashed.password.value',
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Demo User"}'::jsonb,
      false,
      'authenticated'
    );
    
    RAISE NOTICE 'Created demo user with ID: %', demo_user_uuid;
  ELSE
    RAISE NOTICE 'Demo user already exists';
  END IF;
  
  -- Create profile for demo user if not exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = demo_user_uuid) THEN
    INSERT INTO profiles (
      id,
      display_name,
      avatar_url,
      xp_total,
      current_level
    ) VALUES (
      demo_user_uuid,
      'Demo User',
      NULL,
      0,
      1
    );
    
    RAISE NOTICE 'Created demo profile';
  ELSE
    RAISE NOTICE 'Demo profile already exists';
  END IF;
END $$;

-- Create demo project (if not exists)
DO $$
DECLARE
  demo_user_uuid uuid := '00000000-0000-0000-0000-000000000001';
  demo_project_uuid uuid := '00000000-0000-0000-0000-000000000002';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM projects WHERE id = demo_project_uuid) THEN
    INSERT INTO projects (
      id,
      owner_id,
      name,
      description,
      goal,
      location,
      avatar_url,
      external_links,
      problem_statement,
      target_audience,
      value_proposition,
      tech_stack,
      current_stage,
      created_at,
      updated_at
    ) VALUES (
      demo_project_uuid,
      demo_user_uuid,
      'My First Project',
      'Building something amazing with Codyssey',
      'Launch in 30 days',
      'Massachusetts, United States',
      NULL,
      jsonb_build_object(
        'github', '',
        'demo', '',
        'cursor', '',
        'lovable', '',
        'bolt', ''
      ),
      'Users need better tools to ship their ideas faster',
      'Indie hackers, startups, and developers building MVPs',
      'Ship your MVP 10x faster with AI-powered helpers',
      'Next.js, TypeScript, Supabase, OpenAI',
      'mvp_build',
      now(),
      now()
    );
    
    RAISE NOTICE 'Created demo project with ID: %', demo_project_uuid;
  ELSE
    RAISE NOTICE 'Demo project already exists';
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON auth.users TO anon, authenticated;

-- Final completion message
DO $$
BEGIN
  RAISE NOTICE '=================================';
  RAISE NOTICE 'Dev mode setup complete!';
  RAISE NOTICE 'Demo user ID: 00000000-0000-0000-0000-000000000001';
  RAISE NOTICE 'Demo project ID: 00000000-0000-0000-0000-000000000002';
  RAISE NOTICE '=================================';
END $$;

