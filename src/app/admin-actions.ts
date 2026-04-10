"use server";

import { getServerAuthClient } from "@/lib/supabase-server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

/**
 * FETCH GLOBAL SYSTEM STATS
 * Only accessible to role='admin'
 */
export async function getSuperAdminOverview() {
  noStore();
  const supabase = getServerAuthClient();
  
  const { data: stats, error } = await supabase
    .from('admin_stats')
    .select('*')
    .single();

  const { data: recentUsers } = await supabase
    .from('admin_user_management')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return { 
    stats: stats || { total_users: 0, total_bots: 0, total_tokens: 0, total_revenue: 0 },
    recentUsers: recentUsers || [],
    error 
  };
}

/**
 * FETCH ALL USERS
 */
export async function getAllUsers() {
  noStore();
  const supabase = getServerAuthClient();
  const { data, error } = await supabase
    .from('admin_user_management')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

/**
 * FETCH ALL BOTS + INSTRUCTIONS ACROSS THE ENTIRE PLATFORM
 * Allows monitoring of how users are configuring their agents
 */
export async function getAllBotsAcrossPlatform() {
  noStore();
  const supabase = getServerAuthClient();
  const { data, error } = await supabase
    .from('bots')
    .select(`
      id, 
      name, 
      system_prompt, 
      model_name, 
      created_at,
      users (email)
    `)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

/**
 * MANUALLY ADJUST USER CREDITS (Tokens)
 */
export async function adjustUserCredits(userId: string, amount: number) {
  const supabase = getServerAuthClient();
  
  const { error } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      amount: amount,
      type: amount >= 0 ? 'credit' : 'charge',
      status: 'success'
    }]);

  revalidatePath('/super-admin');
  return { success: !error, error };
}

/**
 * UPDATE USER STATUS / ROLE
 */
export async function updateUserByAdmin(userId: string, updates: { role?: string, status?: string }) {
  const supabase = getServerAuthClient();
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);
  
  revalidatePath('/super-admin');
  return { success: !error, error };
}

/**
 * FETCH GLOBAL USAGE HISTORY
 */
export async function getGlobalUsageLogs() {
  noStore();
  const supabase = getServerAuthClient();
  const { data } = await supabase
    .from('usage')
    .select('*, users(email), bots(name)')
    .order('created_at', { ascending: false })
    .limit(100);
  return data || [];
}
