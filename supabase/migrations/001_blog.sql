-- Omnia blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  meta_description text not null default '',
  cover_image_path text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc nulls last);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

create or replace function public.set_blog_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  );

-- Storage bucket (run in dashboard if migration cannot create buckets)
insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

drop policy if exists "Public read blog covers" on storage.objects;
create policy "Public read blog covers"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-covers');

-- Service role uploads via API; allow authenticated insert if needed later
drop policy if exists "Service insert blog covers" on storage.objects;
create policy "Service insert blog covers"
  on storage.objects
  for insert
  to service_role
  with check (bucket_id = 'blog-covers');
