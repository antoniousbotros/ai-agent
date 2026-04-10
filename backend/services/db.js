import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use Service Role Key to bypass RLS securely internally in Node.js
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Validate the API key provided from the widget
export async function validateApiKey(keyString) {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id, is_active')
      .eq('key_string', keyString)
      .single();
      
    if (error || !data?.is_active) {
      return null;
    }
    return data.user_id; 
  } catch(e) {
    console.error("Auth Error:", e);
    return null;
  }
}

// Fetch bot configuration including branding and channel tokens
export async function getBotConfig(botId, userId) {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return {
      name: data.name,
      system_prompt: data.system_prompt,
      model_name: data.model_name,
      primary_color: data.primary_color,
      logo_url: data.logo_url,
      position: data.position,
      theme: data.theme,
      meta_page_access_token: data.meta_page_access_token
    };
  } catch (e) {
    console.error("Bot Fetch Error:", e);
    return null;
  }
}

// Log token usage async so it doesn't block
export async function logUsage(userId, botId, tokens) {
  try {
    const cost = (tokens / 1000) * 0.0001; 
    
    await supabase.from('usage').insert([{
      user_id: userId,
      bot_id: botId,
      tokens_used: tokens,
      cost_incurred: cost
    }]);
    
  } catch(e) {
    console.error("Could not log usage:", e);
  }
}

// Save the full chat transcript text using formatted messages JSONB for the system
export async function logChatTranscript(userId, botId, platform, queryText, responseText) {
  try {
    const messages = [
      { role: 'user', content: queryText, timestamp: new Date().toISOString() },
      { role: 'assistant', content: responseText, timestamp: new Date().toISOString() }
    ];

    await supabase.from('chat_transcripts').insert([{
      bot_id: botId,
      platform: platform, // 'web' | 'messenger' | 'instagram' | 'slack'
      user_identifier: 'Guest', 
      messages: messages,
      status: 'active'
    }]);
  } catch(e) {
    console.error("Could not log transcript:", e);
  }
}
