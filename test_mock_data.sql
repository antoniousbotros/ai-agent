-- IMPORTANT: Run this inside your Supabase SQL Editor.

-- 1. Insert the mock ID into Supabase Auth First to satisfy Foreign Keys!
INSERT INTO auth.users (id) 
VALUES ('11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 2. Create the mock user for testing mapping to the Auth user
INSERT INTO public.users (id, email) 
VALUES ('11111111-1111-1111-1111-111111111111', 'testadmin@rabeh.ai')
ON CONFLICT (id) DO NOTHING;

-- 3. Create the API Key linked to the mock user 
INSERT INTO public.api_keys (user_id, key_string, name) 
VALUES ('11111111-1111-1111-1111-111111111111', 'RABEH_TEST_KEY_9999', 'Local Localhost Test Key')
ON CONFLICT (key_string) DO NOTHING;

-- 4. Create the Bot linked to the mock user 
-- (Note: your schema uses system_prompt and model_name!)
INSERT INTO public.bots (id, user_id, name, system_prompt, model_name) 
VALUES (
    '22222222-2222-2222-2222-222222222222', 
    '11111111-1111-1111-1111-111111111111',
    'Customer Support Bot',
    'You are a helpful SaaS assistant named Rabeh. Provide extremely short, precise answers.',
    'gemma:2b'
)
ON CONFLICT (id) DO NOTHING;
