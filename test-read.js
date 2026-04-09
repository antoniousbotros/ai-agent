import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function testRead() {
  const { data, error } = await supabase.from('bots').select('system_prompt').eq('id', '22222222-2222-2222-2222-222222222222');
  console.log('Read result:', data, 'Error:', error);
}
await testRead();
