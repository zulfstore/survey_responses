-- ==============================================================================
-- ZULF BRAND LAB - Supabase Database Schema & Row-Level Security (RLS)
-- Organization: ZULF (SMC-PRIVATE) LIMITED
-- Target Platform: Supabase PostgreSQL + Vercel / GitHub
-- ==============================================================================

-- 1. Create responses table
CREATE TABLE IF NOT EXISTS public.responses (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    
    -- Demographics & Profile
    occupation TEXT,
    age TEXT,
    city TEXT,
    online_shopping_frequency TEXT,
    
    -- Concept Discovery & High-level picks
    first_concept TEXT,
    buying_concepts TEXT[] DEFAULT '{}',
    tiktok_concept TEXT,
    first_purchase_concept TEXT,
    
    -- RYVEN Specifics
    ryven_interest INTEGER,
    ryven_products TEXT[] DEFAULT '{}',
    ryven_price TEXT,
    ryven_repurchase TEXT,
    ryven_drivers TEXT[] DEFAULT '{}',
    
    -- KĀRVO Specifics
    karvo_interest INTEGER,
    karvo_products TEXT[] DEFAULT '{}',
    karvo_small_price TEXT,
    karvo_lamp_price TEXT,
    karvo_drivers TEXT[] DEFAULT '{}',
    
    -- CAR CARE Specifics
    car_care_interest INTEGER,
    car_care_products TEXT[] DEFAULT '{}',
    car_care_buy_first TEXT,
    car_care_price TEXT,
    car_care_drivers TEXT[] DEFAULT '{}',
    
    -- SMALL BUSINESS PACKAGING Specifics
    packaging_business_status TEXT,
    packaging_channels TEXT[] DEFAULT '{}',
    packaging_products TEXT[] DEFAULT '{}',
    packaging_bundle TEXT,
    packaging_budget TEXT,
    packaging_repeat TEXT,
    
    -- EVERYDAY PROBLEM SOLVERS Specifics
    problem_solver_frequency TEXT,
    problem_solver_category TEXT,
    problem_solver_problem TEXT,
    
    -- Price Psychology & Online Drivers
    online_priority_drivers TEXT[] DEFAULT '{}',
    premium_willingness TEXT,
    
    -- Social Media Video Hook & Follow Choice
    social_media_choice TEXT,
    social_media_follow_choice TEXT[] DEFAULT '{}',
    
    -- Real 30-Day Purchase Intent
    final_purchase_choice TEXT,
    purchase_budget TEXT,
    purchase_intent INTEGER CHECK (purchase_intent >= 1 AND purchase_intent <= 5),
    
    -- Qualitative Verbatim
    feedback TEXT,
    desired_product TEXT,
    
    -- VIP Launch Contact Opt-in
    contact_permission BOOLEAN DEFAULT false,
    whatsapp TEXT,
    email TEXT
);

-- 2. Indexes for fast aggregation and querying
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON public.responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_final_choice ON public.responses(final_purchase_choice);
CREATE INDEX IF NOT EXISTS idx_responses_city ON public.responses(city);

-- ==============================================================================
-- 3. SECURE ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- The public survey must only be able to INSERT responses.
-- The public survey must NEVER be able to read all responses.
-- Only authenticated admin users can read survey responses.
-- ==============================================================================

-- Enable RLS on the table
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can submit responses only" ON public.responses;
DROP POLICY IF EXISTS "Admins can view responses" ON public.responses;
DROP POLICY IF EXISTS "Admins can update responses" ON public.responses;
DROP POLICY IF EXISTS "Admins can delete responses" ON public.responses;

-- Policy 1: Anyone (including unauthenticated public visitors / anon) can INSERT responses.
CREATE POLICY "Public can submit responses only"
ON public.responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: ONLY authenticated users (Admins signed in via Supabase Auth) can SELECT (read) responses.
-- Anonymous visitors have NO SELECT grant and will receive 0 rows or permission denied.
CREATE POLICY "Admins can view responses"
ON public.responses
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authenticated admins can delete or reset responses if needed
CREATE POLICY "Admins can delete responses"
ON public.responses
FOR DELETE
TO authenticated
USING (true);

-- Policy 4: Authenticated admins can update responses if needed
CREATE POLICY "Admins can update responses"
ON public.responses
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- 4. Useful Real-time Summary View (Accessible to Authenticated Admins)
-- ==============================================================================
CREATE OR REPLACE VIEW public.vw_brand_validation_summary AS
SELECT 
    final_purchase_choice AS brand_id,
    COUNT(*) AS total_votes,
    ROUND(AVG(purchase_intent), 2) AS avg_purchase_intent,
    COUNT(CASE WHEN contact_permission = true THEN 1 END) AS vip_leads_count
FROM public.responses
WHERE final_purchase_choice IS NOT NULL
GROUP BY final_purchase_choice
ORDER BY total_votes DESC;
