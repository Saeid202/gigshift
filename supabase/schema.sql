-- ─────────────────────────────────────────
-- GigShift Database Schema
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null check (role in ('employer', 'worker', 'admin')),
  full_name text,
  company_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Shifts table
create table if not exists public.shifts (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  location text not null,
  pay_rate numeric(10,2) not null,
  shift_date date not null,
  start_time time not null,
  end_time time not null,
  spots integer not null default 1,
  status text not null default 'open' check (status in ('open', 'filled', 'cancelled')),
  created_at timestamptz default now()
);

-- Applications table
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  shift_id uuid references public.shifts(id) on delete cascade not null,
  worker_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  unique(shift_id, worker_id)
);

-- ─── RLS Policies ───────────────────────

alter table public.profiles enable row level security;
alter table public.shifts enable row level security;
alter table public.applications enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Anyone can view basic profiles"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Shifts: employers manage their own, everyone can read open shifts
create policy "Employers can insert shifts"
  on public.shifts for insert
  with check (auth.uid() = employer_id);

create policy "Employers can update own shifts"
  on public.shifts for update using (auth.uid() = employer_id);

create policy "Employers can delete own shifts"
  on public.shifts for delete using (auth.uid() = employer_id);

create policy "Anyone can view open shifts"
  on public.shifts for select using (true);

-- Applications: workers manage their own
create policy "Workers can apply"
  on public.applications for insert
  with check (auth.uid() = worker_id);

create policy "Workers can view own applications"
  on public.applications for select
  using (auth.uid() = worker_id);

create policy "Employers can view applications for their shifts"
  on public.applications for select
  using (
    exists (
      select 1 from public.shifts
      where shifts.id = applications.shift_id
      and shifts.employer_id = auth.uid()
    )
  );

create policy "Employers can update application status"
  on public.applications for update
  using (
    exists (
      select 1 from public.shifts
      where shifts.id = applications.shift_id
      and shifts.employer_id = auth.uid()
    )
  );

-- ─── Auto-create profile on signup ──────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'worker'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Worker Profile Extensions ──────────

alter table public.profiles
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists province text;

-- Work Experience
create table if not exists public.work_experience (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.profiles(id) on delete cascade not null,
  job_title text not null,
  company text not null,
  start_date date,
  end_date date,
  description text,
  created_at timestamptz default now()
);

-- Payroll Info
create table if not exists public.payroll_info (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.profiles(id) on delete cascade not null unique,
  bank_name text,
  account_number text,
  transit_number text,
  institution_number text,
  sin text,
  created_at timestamptz default now()
);

-- Availability
create table if not exists public.availability (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.profiles(id) on delete cascade not null unique,
  days text[],
  shift_types text[],
  max_hours_per_week integer,
  created_at timestamptz default now()
);

-- RLS
alter table public.work_experience enable row level security;
alter table public.payroll_info enable row level security;
alter table public.availability enable row level security;

create policy "Workers manage own experience"
  on public.work_experience for all using (auth.uid() = worker_id);

create policy "Workers manage own payroll"
  on public.payroll_info for all using (auth.uid() = worker_id);

create policy "Workers manage own availability"
  on public.availability for all using (auth.uid() = worker_id);

-- ─── Worker Skills (replaces work_experience) ───
create table if not exists public.worker_skills (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.profiles(id) on delete cascade not null unique,
  availability_type text, -- 'part_time' | 'full_time'
  description text,
  languages text[],
  forklift boolean default false,
  driving_license boolean default false,
  license_class text, -- 'G1' | 'G2' | 'G'
  lift_capacity text, -- '10lbs' | '25lbs' | '50lbs' | '75lbs+'
  created_at timestamptz default now()
);

alter table public.worker_skills enable row level security;
create policy "Workers manage own skills" on public.worker_skills for all using (auth.uid() = worker_id);

alter table public.worker_skills
  add column if not exists forklift_license boolean default false,
  add column if not exists forklift_license_url text;

-- ─── Company Profile ───────────────────
alter table public.profiles
  add column if not exists contact_person text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists company_type text;
