# Database Seeding Guide

## Why you need to seed the database

The Active Tasks Card will only show up if there are tasks in the database for the current level. Currently, the database needs to be seeded with the initial levels and tasks data.

## How to Seed Your Supabase Database

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `db/seed.sql` from your project
5. Paste it into the SQL editor
6. Click **Run** to execute the seed data

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in
npx supabase login

# Link your project (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Run the seed file
npx supabase db push --file db/seed.sql
```

## What Gets Seeded

The seed file creates:

### Levels (5 total)
1. **Spark** - Find your idea and validate your vision
2. **Build Prep** - Plan your tech stack and architecture  
3. **Core Build** - Build your MVP with essential features
4. **Launch** - Ship your product to the world
5. **Grow** - Scale and optimize for growth

### Tasks (30+ total)
- Level 1: 5 tasks (Define Problem, Research Competition, etc.)
- Level 2: 6 tasks (Choose Tech Stack, Design Architecture, etc.)
- Level 3: 7 tasks (Setup Dev Environment, Build Auth, etc.)
- Level 4: 6 tasks (Deploy to Production, Launch Product, etc.)
- Level 5: 6 tasks (Analyze Metrics, Reach 100 Users, etc.)

## Verification

After seeding, you can verify the data was inserted:

1. Go to **Table Editor** in Supabase Dashboard
2. Check the **levels** table - should have 5 rows
3. Check the **tasks** table - should have 30+ rows

## Testing the Active Tasks Card

Once seeded:
1. Refresh your app (the dashboard will load the tasks)
2. Click on any orb in the Journey view
3. Click the **START** button on the level card
4. You should now see the **Active Tasks Card** in the top-left of the helper's chat UI

The card will show all tasks for Level 1 (since that's the starting level) with their:
- Title
- XP reward
- Status icon (○ for todo, ⟳ for in_progress, ✓ for done)

