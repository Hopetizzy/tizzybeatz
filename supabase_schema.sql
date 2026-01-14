-- Create the products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null check (type in ('beat', 'sample-pack', 'midi-pack')),
  price numeric not null default 0,
  is_free boolean default false,
  audio_preview_url text,
  thumbnail_url text,
  description text,
  tags text[],
  bpm numeric,
  key text,
  file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create policies (Adjust as needed for your auth requirements)
-- Allow read access to everyone
create policy "Public products are viewable by everyone"
  on public.products for select
  using ( true );

-- Allow insert/update/delete access to EVERYONE (for demo purposes)
-- WARNING: In a real production app, you MUST switch this back to 'authenticated'
-- and implement proper user authentication.
create policy "Public users can modify products"
  on public.products for all
  using ( true );

-- STORAGE SETUP
-- Note: You might need to enable the storage extension if not already enabled.
-- You can run this in the SQL Editor.

-- Create the 'products' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Set up access policies for the 'products' bucket
-- 1. Allow public access to view files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );

-- 2. Allow public users to upload files (Demo only)
create policy "Public Upload"
on storage.objects for insert
with check ( bucket_id = 'products' );

-- 3. Allow public users to update/delete files (Demo only)
create policy "Public Update/Delete"
on storage.objects for all
using ( bucket_id = 'products' );

-- Create Collaborations Table
create table public.collaborations (
  id uuid default gen_random_uuid() primary key,
  sender_name text not null,
  sender_email text not null,
  project_type text not null,
  message text not null,
  demo_url text, -- Optional link to uploaded file
  status text default 'pending', -- pending, contacted, accepted, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Collaborations
alter table public.collaborations enable row level security;

-- Policy: Allow public to insert (Submit Request)
create policy "Allow public insert collaborations"
on public.collaborations for insert
to public
with check (true);

-- Policy: Allow public to select (Admin View - simplified for demo)
create policy "Allow public select collaborations"
on public.collaborations for select
to public
using (true);
create policy "Allow public update collaborations"
on public.collaborations for update
to public
using (true);

-- Create Storage Bucket for Collab Demos
insert into storage.buckets (id, name, public)
values ('collabs', 'collabs', true)
on conflict (id) do nothing;

-- Storage Policy: Allow public to upload demos
create policy "Allow public upload collabs"
on storage.objects for insert
to public
with check (bucket_id = 'collabs');

-- Storage Policy: Allow public to read demos (Admin playback)
create policy "Allow public read collabs"
on storage.objects for select
to public
using (bucket_id = 'collabs');

-- Create Transactions Table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  reference text not null unique,
  email text not null,
  amount numeric not null, -- stored in kobo/cents usually, but we will store as naira/dollars for display simplicity if converted
  products jsonb default '[]'::jsonb, -- Store list of products purchased
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Transactions
alter table public.transactions enable row level security;

-- Policy: Allow public to insert (Record Transaction)
create policy "Allow public insert transactions"
on public.transactions for insert
to public
with check (true);

-- Policy: Allow public to select (Admin View)
create policy "Allow public select transactions"
on public.transactions for select
to public
using (true);
