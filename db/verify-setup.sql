-- ============================================
-- DATABASE SETUP VERIFICATION
-- ============================================
-- Run this AFTER running complete-setup.sql
-- to verify everything was created correctly
-- ============================================

-- Check 1: Do all required tables exist?
DO $$
DECLARE
  missing_tables TEXT[];
  table_name TEXT;
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'CHECKING DATABASE SETUP';
  RAISE NOTICE '============================================';
  
  -- Check for all required tables
  SELECT ARRAY_AGG(t.table_name)
  INTO missing_tables
  FROM (
    VALUES 
      ('profiles'),
      ('projects'),
      ('levels'),
      ('tasks'),
      ('journeys'),
      ('task_progress'),
      ('chat_sessions'),
      ('chat_messages'),
      ('journey_progress'),
      ('helper_level_tasks'),
      ('user_app_state'),
      ('events')
  ) AS required_tables(table_name)
  WHERE NOT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = required_tables.table_name
  );
  
  IF missing_tables IS NULL THEN
    RAISE NOTICE '✅ All 12 tables exist!';
  ELSE
    RAISE WARNING '❌ Missing tables: %', array_to_string(missing_tables, ', ');
    RAISE EXCEPTION 'Setup incomplete! Run complete-setup.sql first.';
  END IF;
END $$;

-- Check 2: Were levels seeded?
DO $$
DECLARE
  level_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO level_count FROM levels;
  
  IF level_count = 5 THEN
    RAISE NOTICE '✅ All 5 levels seeded correctly';
  ELSE
    RAISE WARNING '❌ Expected 5 levels, found %', level_count;
  END IF;
END $$;

-- Check 3: Were tasks seeded?
DO $$
DECLARE
  task_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO task_count FROM tasks;
  
  IF task_count > 0 THEN
    RAISE NOTICE '✅ Found % tasks', task_count;
  ELSE
    RAISE WARNING '❌ No tasks found! Run seed.sql';
  END IF;
END $$;

-- Check 4: Does demo user exist?
DO $$
DECLARE
  demo_user_exists BOOLEAN;
  demo_project_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = '00000000-0000-0000-0000-000000000001'
  ) INTO demo_user_exists;
  
  SELECT EXISTS (
    SELECT 1 FROM projects 
    WHERE id = '00000000-0000-0000-0000-000000000002'
  ) INTO demo_project_exists;
  
  IF demo_user_exists THEN
    RAISE NOTICE '✅ Demo user exists';
  ELSE
    RAISE WARNING '❌ Demo user not found';
  END IF;
  
  IF demo_project_exists THEN
    RAISE NOTICE '✅ Demo project exists';
  ELSE
    RAISE WARNING '❌ Demo project not found';
  END IF;
END $$;

-- Check 5: Does demo project have new fields?
DO $$
DECLARE
  project_record RECORD;
BEGIN
  SELECT 
    goal,
    location,
    problem_statement,
    target_audience,
    value_proposition,
    tech_stack,
    current_stage
  INTO project_record
  FROM projects
  WHERE id = '00000000-0000-0000-0000-000000000002';
  
  IF FOUND THEN
    RAISE NOTICE '✅ Project fields:';
    RAISE NOTICE '  - Goal: %', COALESCE(project_record.goal, 'NOT SET');
    RAISE NOTICE '  - Location: %', COALESCE(project_record.location, 'NOT SET');
    RAISE NOTICE '  - Stage: %', COALESCE(project_record.current_stage, 'NOT SET');
  END IF;
END $$;

-- Check 6: Are indexes created?
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) 
  INTO index_count
  FROM pg_indexes 
  WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';
  
  IF index_count >= 18 THEN
    RAISE NOTICE '✅ Found % performance indexes', index_count;
  ELSE
    RAISE WARNING '⚠️  Expected ~18 indexes, found %', index_count;
  END IF;
END $$;

-- Check 7: Are triggers created?
DO $$
DECLARE
  trigger_count INTEGER;
BEGIN
  SELECT COUNT(*) 
  INTO trigger_count
  FROM information_schema.triggers 
  WHERE trigger_schema = 'public';
  
  IF trigger_count >= 6 THEN
    RAISE NOTICE '✅ Found % triggers', trigger_count;
  ELSE
    RAISE WARNING '⚠️  Expected ~6+ triggers, found %', trigger_count;
  END IF;
END $$;

-- Final Summary
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'VERIFICATION COMPLETE!';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'If you see all ✅ above, your database is ready!';
  RAISE NOTICE 'Go to http://localhost:3000 and start coding!';
  RAISE NOTICE '============================================';
END $$;

-- Display table counts for reference
SELECT 
  'profiles' as table_name, 
  COUNT(*) as row_count 
FROM profiles
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'levels', COUNT(*) FROM levels
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'chat_sessions', COUNT(*) FROM chat_sessions
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'journey_progress', COUNT(*) FROM journey_progress
UNION ALL
SELECT 'helper_level_tasks', COUNT(*) FROM helper_level_tasks
UNION ALL
SELECT 'user_app_state', COUNT(*) FROM user_app_state
ORDER BY table_name;


