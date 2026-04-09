import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function seed() {
  const userId = '00000000-0000-0000-0000-000000000000';
  
  await supabase.from('users').upsert({ id: userId, email: 'admin@local.test' });
  await supabase.from('api_keys').upsert({ user_id: userId, key_string: 'RABEH_TEST_KEY_9999' });
  await supabase.from('bots').upsert({ id: '22222222-2222-2222-2222-222222222222', user_id: userId, name: 'Customer Support Bot', system_prompt: 'You are a helpful SaaS agent representing this website.', model_name: 'gemma:2b' });
  console.log('Seeded successfully!');
}
seed();
