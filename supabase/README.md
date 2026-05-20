# Omnia blog — Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the migration: [`migrations/001_blog.sql`](migrations/001_blog.sql).
3. Confirm the **blog-covers** storage bucket exists (public). If the migration did not create it, add a public bucket named `blog-covers` in Storage.
4. Copy **Project URL**, **anon key**, and **service role key** into `.env.local` (see [`.env.example`](../.env.example)).
5. Set `ADMIN_PASSWORD` and a long random `ADMIN_SESSION_SECRET` (16+ characters).
6. Set `CRON_SECRET` for Vercel scheduled publishing (same value in Vercel env; cron sends `Authorization: Bearer <CRON_SECRET>`).

After deploy, open `/admin/login` to write posts. Public blog: `/blog`.
