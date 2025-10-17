-- Supabase Database Setup for Vue Calendar App
-- Run this SQL in your Supabase SQL Editor

-- Create the events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  start TIMESTAMPTZ NOT NULL,
  end TIMESTAMPTZ,
  color TEXT DEFAULT '#3788d8',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on start date for better query performance
CREATE INDEX IF NOT EXISTS idx_events_start ON events(start);

-- Create an index on title for search functionality
CREATE INDEX IF NOT EXISTS idx_events_title ON events(title);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- For a public calendar, you might want to allow all operations for everyone
CREATE POLICY "Allow all operations for everyone" ON events
  FOR ALL USING (true) WITH CHECK (true);

-- Alternative: If you want to restrict to authenticated users only
-- CREATE POLICY "Allow all operations for authenticated users" ON events
--   FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample events (optional)
INSERT INTO events (title, start, end, color) VALUES
  ('Sample Event 1', '2024-01-15 10:00:00+00', '2024-01-15 11:00:00+00', '#28a745'),
  ('Sample Event 2', '2024-01-20 14:00:00+00', '2024-01-20 16:00:00+00', '#ffc107'),
  ('Sample Event 3', '2024-01-25 09:00:00+00', '2024-01-25 17:00:00+00', '#dc3545');
