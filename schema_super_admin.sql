-- 1. Add Role and Metadata to User profiles
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Set your admin account as the first Super Admin
UPDATE public.users SET role = 'admin' WHERE email = 'admin@local.test';

-- 2. Create a View for Global Stats (Revenue, Bots, Usage)
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.bots) as total_bots,
  (SELECT COALESCE(SUM(tokens_used), 0) FROM public.usage) as total_tokens,
  (SELECT COALESCE(SUM(amount), 0) FROM public.transactions WHERE status = 'success' AND type = 'credit') as total_revenue;

-- 3. Detailed User List View
CREATE OR REPLACE VIEW public.admin_user_management AS
SELECT 
  u.id, 
  u.email, 
  u.full_name, 
  u.company_name, 
  u.role, 
  u.status,
  u.created_at,
  (SELECT COUNT(*) FROM public.bots b WHERE b.user_id = u.id) as bot_count,
  (SELECT COALESCE(SUM(tokens_used), 0) FROM public.usage us WHERE us.user_id = u.id) as token_usage
FROM public.users u;
