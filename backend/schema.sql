-- Run this in your Supabase SQL Editor

-- 1. USERS Table (Tracks limits)
create table if not exists users (
  ip_address text primary key,
  plan text default 'free', -- 'free' or 'pro'
  msg_count int default 0,
  last_active_date date default current_date,
  created_at timestamp with time zone default now()
);

-- 2. TRANSACTIONS Table (Tracks money)
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_ip text references users(ip_address),
  razorpay_order_id text,
  razorpay_payment_id text,
  amount int, -- in paise
  status text, -- 'created', 'paid'
  created_at timestamp with time zone default now()
);

-- 3. GLOBAL STATS (Safety Cap)
create table if not exists global_stats (
  date date primary key default current_date,
  total_requests int default 0
);

-- Enable Row Level Security (RLS) - Optional for now as backend is admin
alter table users enable row level security;
alter table transactions enable row level security;
alter table global_stats enable row level security;

-- Authentication & Migration Schema Updates

-- 1. Drop dependencies (Foreign Key from transactions)
-- Note: 'transactions_user_ip_fkey' is the standard default name. 
-- If this fails, check your transactions table constraints.
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_ip_fkey;

-- 2. Drop the old Primary Key (IP Address)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;

-- 3. Add a new robust Primary Key (UUID)
ALTER TABLE users ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- 4. Now relax IP Address (allow NULL)
ALTER TABLE users ALTER COLUMN ip_address DROP NOT NULL;

-- 5. Add Auth Columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 6. Enforce: Must have identifier (IP OR Email)
-- Clean up invalid rows first to prevent constraint violations
DELETE FROM users WHERE ip_address IS NULL AND (email IS NULL OR email = '');

ALTER TABLE users DROP CONSTRAINT IF EXISTS user_identifier_check;
ALTER TABLE users ADD CONSTRAINT user_identifier_check 
    CHECK (ip_address IS NOT NULL OR email IS NOT NULL);

-- 7. Add Indices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_ip ON users(ip_address);

-- 8. Contact Submissions Table (for landing page contact form)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Index for querying by date
-- Note: Re-creating this table with correct column names just in case it was created incorrectly before
DROP TABLE IF EXISTS contact_submissions;
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_date ON contact_submissions(submitted_at DESC);

-- Enable RLS (optional - backend uses service role)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 9. Gumroad Payment Integration (for international users)
-- Add Gumroad tracking columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gumroad_sale_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'razorpay';

-- Add Gumroad tracking columns to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS gumroad_sale_id TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'razorpay';

-- Add indices for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_gumroad_sale ON users(gumroad_sale_id);
CREATE INDEX IF NOT EXISTS idx_transactions_gumroad_sale ON transactions(gumroad_sale_id);
CREATE INDEX IF NOT EXISTS idx_users_payment_provider ON users(payment_provider);

