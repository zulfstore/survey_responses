# ZULF BRAND LAB — Production Deployment Guide

This application is built with **React, Vite, TypeScript, Tailwind CSS, and Supabase** with Row-Level Security (RLS). It is ready for continuous deployment through **GitHub and Vercel**.

---

## 1. Supabase Database Setup

1. Log into your [Supabase Dashboard](https://supabase.com) and create a new project.
2. Go to **SQL Editor** in the left sidebar.
3. Open or copy the contents of `/supabase/schema.sql` from this repository.
4. Click **Run** to execute the script.
   This creates:
   - The `responses` table with appropriate fields and data types.
   - Performance indexes on `created_at`, `final_purchase_choice`, and `city`.
   - **Row-Level Security (RLS)** policies:
     - `Public can submit responses only`: Allows anonymous users to **INSERT** survey answers.
     - `Admins can view responses`: Restricts **SELECT (read)** access exclusively to authenticated admin accounts. Anonymous visitors cannot view or query responses.
     - `Admins can update / delete`: Gives authenticated admins management control.
   - `vw_brand_validation_summary` aggregate view.

5. In **Authentication > Users**, click **Add user > Create user** to create your admin account (e.g. `admin@zulf.com` with a strong password).

6. Go to **Project Settings > API** and copy:
   - **Project URL**
   - **anon / public key**

---

## 2. GitHub Setup

1. Initialize git and push this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: ZULF Brand Lab production release"
   git remote add origin https://github.com/<your-username>/zulf-brand-lab.git
   git branch -M main
   git push -u origin main
   ```

---

## 3. Vercel Deployment

1. Log into [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your `zulf-brand-lab` GitHub repository.
3. Under **Build and Output Settings**, Vercel will automatically detect `Vite`:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase Project URL (`https://your-id.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` = your Supabase `anon` public key
   - `VITE_ADMIN_PASSCODE` = `zulf2026` (or your preferred admin review passcode)
5. Click **Deploy**.

---

## 4. Local Development

To run locally with Supabase credentials:
```bash
cp .env.example .env
# Edit .env with your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

*Note: If `VITE_SUPABASE_URL` is omitted or empty, the app runs in local-storage mode with seeded benchmark data.*
