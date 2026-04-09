"use server";

import { getServerAuthClient } from "@/lib/supabase-server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getDashboardData() {
  noStore(); // Completely prevent static caching for live UI rendering
  const supabase = getServerAuthClient();
  
  const [keysRes, botsRes, usageRes] = await Promise.all([
    supabase.from('api_keys').select('*').limit(5),
    supabase.from('bots').select('*').order('created_at', { ascending: false }),
    supabase.from('usage').select('*').order('created_at', { ascending: false }).limit(50)
  ]);

  return {
    keys: keysRes.data || [],
    bots: botsRes.data || [],
    usage: usageRes.data || []
  };
}

export async function createNewBot() {
  const supabase = getServerAuthClient();
  const userId = '00000000-0000-0000-0000-000000000000';
  const newBotId = crypto.randomUUID();
  
  const { error } = await supabase.from('bots').insert({
    id: newBotId,
    user_id: userId,
    name: 'New Chatbot',
    model_name: 'gemma:2b',
    system_prompt: 'You are a helpful UI assistant.'
  });
  
  revalidatePath('/', 'layout');
  return { success: !error, newBotId, error };
}

export async function updateBotConfig(botId: string, name: string, prompt: string, modelName: string) {
  const supabase = getServerAuthClient();
  const { error } = await supabase.from('bots').update({ 
    name: name,
    system_prompt: prompt,
    model_name: modelName
  }).eq('id', botId);
  revalidatePath('/', 'layout');
  return { success: !error, error };
}

export async function deleteBot(botId: string) {
  const supabase = getServerAuthClient();
  const { error } = await supabase.from('bots').delete().eq('id', botId);
  revalidatePath('/', 'layout');
  return { success: !error, error };
}

export async function generateApiKey() {
  const supabase = getServerAuthClient();
  
  // Generate a random, cryptographically secure-looking key
  const newKey = 'sb_test_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // The default test user ID we set up for this local instance
  const userId = '00000000-0000-0000-0000-000000000000';
  
  const { error } = await supabase.from('api_keys').insert({
    user_id: userId,
    key_string: newKey
  });
  
  revalidatePath('/', 'layout');
  return { success: !error, newKey, error };
}

export async function getUserProfile() {
  const supabase = getServerAuthClient();
  const userId = '11111111-1111-1111-1111-111111111111'; // Assuming this is the admin ID from the previous dump
  
  const { data } = await supabase.from('users').select('*').eq('id', userId).single();
  return data;
}

export async function updateUserProfile(fullName: string, companyName: string) {
  const supabase = getServerAuthClient();
  const userId = '11111111-1111-1111-1111-111111111111';
  
  const { error } = await supabase.from('users').update({
    full_name: fullName,
    company_name: companyName
  }).eq('id', userId);
  
  if (!error) {
     revalidatePath('/', 'layout');
  }
  return { success: !error, error };
}
