-- Create tables for Medical AI Intake Agent

-- Bots table to store OpenMic bot configurations
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  openmic_bot_uid TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL DEFAULT 'medical',
  prompt TEXT NOT NULL,
  voice_settings JSONB DEFAULT '{}',
  webhook_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table for medical domain
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  email TEXT,
  allergies TEXT[],
  medical_history TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call logs table to store call transcripts and metadata
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  openmic_call_id TEXT UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  caller_phone TEXT,
  call_duration INTEGER, -- in seconds
  call_status TEXT,
  transcript TEXT,
  summary TEXT,
  function_calls JSONB DEFAULT '[]',
  pre_call_data JSONB DEFAULT '{}',
  post_call_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo app)
-- In production, you'd want proper user-based RLS policies
CREATE POLICY "Allow all operations on bots" ON public.bots FOR ALL USING (true);
CREATE POLICY "Allow all operations on patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on call_logs" ON public.call_logs FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bots_openmic_bot_uid ON public.bots(openmic_bot_uid);
CREATE INDEX IF NOT EXISTS idx_patients_medical_id ON public.patients(medical_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_bot_id ON public.call_logs(bot_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_patient_id ON public.call_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON public.call_logs(created_at DESC);
