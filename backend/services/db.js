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

// Fetch bot configuration
export async function getBotConfig(botId, userId) {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('system_prompt, model_name')
      .eq('id', botId)
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return {
      prompt: data.system_prompt,
      model_id: data.model_name
    };
  } catch (e) {
    console.error("Bot Fetch Error:", e);
    return null;
  }
}
// Log token usage async so it doesn't block
export async function logUsage(userId, botId, tokens) {
  try {
    // Basic computation: $0.0001 per 1000 tokens for local Gemma hardware cost baseline
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
