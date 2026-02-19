-- Auditwise Database Schema
-- This file contains the database schema for the Auditwise application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
-- Note: Supabase auth.users is managed automatically
-- This table stores additional user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audits table - stores design audit information
CREATE TABLE IF NOT EXISTS public.audits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  design_type TEXT NOT NULL CHECK (design_type IN ('figma', 'png', 'pdf', 'url')),
  design_url TEXT,
  design_image_url TEXT,
  audit_depth TEXT NOT NULL CHECK (audit_depth IN ('Quick', 'Standard', 'Deep')),
  audit_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  is_shared BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issues table - stores individual design issues found in audits
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Accessibility', 'UX', 'UI', 'Layout', 'Content')),
  severity TEXT NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  explanation TEXT NOT NULL,
  how_to_fix TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  position_x NUMERIC(5,2) NOT NULL,
  position_y NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON public.audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON public.audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_share_token ON public.audits(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_issues_audit_id ON public.issues(audit_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON public.issues(severity);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Audits policies
CREATE POLICY "Users can view their own audits"
  ON public.audits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared audits"
  ON public.audits FOR SELECT
  USING (is_shared = TRUE);

CREATE POLICY "Users can insert their own audits"
  ON public.audits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audits"
  ON public.audits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audits"
  ON public.audits FOR DELETE
  USING (auth.uid() = user_id);

-- Issues policies
CREATE POLICY "Users can view issues from their audits"
  ON public.issues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.audits
      WHERE audits.id = issues.audit_id
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view issues from shared audits"
  ON public.issues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.audits
      WHERE audits.id = issues.audit_id
      AND audits.is_shared = TRUE
    )
  );

CREATE POLICY "Users can insert issues to their audits"
  ON public.issues FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.audits
      WHERE audits.id = issues.audit_id
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update issues in their audits"
  ON public.issues FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.audits
      WHERE audits.id = issues.audit_id
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete issues from their audits"
  ON public.issues FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.audits
      WHERE audits.id = issues.audit_id
      AND audits.user_id = auth.uid()
    )
  );

-- Functions

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_audits ON public.audits;
CREATE TRIGGER set_updated_at_audits
  BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_issues ON public.issues;
CREATE TRIGGER set_updated_at_issues
  BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate share token
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'Extended user profile information';
COMMENT ON TABLE public.audits IS 'Design audit records with metadata';
COMMENT ON TABLE public.issues IS 'Individual design issues found in audits';
COMMENT ON COLUMN public.audits.share_token IS 'Unique token for sharing audits publicly';
COMMENT ON COLUMN public.issues.position_x IS 'X coordinate (0-100) of issue location in design';
COMMENT ON COLUMN public.issues.position_y IS 'Y coordinate (0-100) of issue location in design';
