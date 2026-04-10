"use client";

import { useEffect, useState } from "react";
import { 
  getSuperAdminOverview, 
  getAllUsers, 
  updateUserByAdmin,
  getAllBotsAcrossPlatform,
  adjustUserCredits
} from "@/app/admin-actions";
import { 
  Users, TrendingUp, Cpu, 
  ShieldCheck, Loader2,
  Activity, AlertCircle, Ban, CheckCircle
} from "lucide-react";
import { GlassButton } from "./ui-components";

export default function SuperAdminTab() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'bots'>('users');

  useEffect(() => {
    async function load() {
      const overview = await getSuperAdminOverview();
      const allUsers = await getAllUsers();
      const allBots = await getAllBotsAcrossPlatform();
      setData(overview.stats);
      setUsers(allUsers.data || []);
      setBots(allBots.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleAdjustCredits = async (userId: string) => {
    const amount = prompt("Enter amount to add (positive) or subtract (negative):");
    if (!amount || isNaN(Number(amount))) return;
    
    await adjustUserCredits(userId, Number(amount));
    alert("Credits adjusted successfully.");
    // Refresh overview data
    const overview = await getSuperAdminOverview();
    setData(overview.stats);
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await updateUserByAdmin(userId, { status: newStatus });
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const promoteToAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to promote this user to Super Admin?")) return;
    await updateUserByAdmin(userId, { role: 'admin' });
    setUsers(users.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Global Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`$${(data?.total_revenue || 0).toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Active Tenants" 
          value={data?.total_users || 0} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Managed Bots" 
          value={data?.total_bots || 0} 
          icon={Cpu} 
          color="bg-purple-500" 
        />
        <StatCard 
          label="Inference Total" 
          value={`${((data?.total_tokens || 0) / 1000000).toFixed(1)}M`} 
          icon={Activity} 
          color="bg-amber-500" 
        />
      </div>

      {/* Sub-Navigation */}
      <div className="flex border-b border-slate-100 dark:border-white/10 gap-8">
        <button 
          onClick={() => setActiveSubTab('users')}
          className={`pb-4 text-[13px] font-semibold transition-all ${activeSubTab === 'users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Tenant Management
        </button>
        <button 
          onClick={() => setActiveSubTab('bots')}
          className={`pb-4 text-[13px] font-semibold transition-all ${activeSubTab === 'bots' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Bot Instruction Library
        </button>
      </div>

      {activeSubTab === 'users' ? (
        <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">User Controls</h3>
              <p className="text-[12px] text-slate-400">Add credits or manage access for any tenant</p>
            </div>
            <GlassButton icon={TrendingUp} onClick={() => alert("Usage Trends coming soon")}>Usage Trends</GlassButton>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5">
                <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">User / Company</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Plan / Usage</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bots</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Credit Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[12px] font-bold">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                          {user.email}
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-blue-500" />}
                        </span>
                        <span className="text-[11px] text-slate-400">{user.company_name || 'Individual'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-700 dark:text-slate-300">{(user.token_usage || 0).toLocaleString()} tokens</span>
                      <div className="w-24 h-1 bg-slate-100 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">{user.bot_count} bots</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {user.status === 'active' ? <CheckCircle className="w-2.5 h-2.5" /> : <Ban className="w-2.5 h-2.5" />}
                      {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <GlassButton 
                        onClick={() => handleAdjustCredits(user.id)}
                        className="text-[11px] h-7 bg-blue-500/10 border-blue-500/20 text-blue-600 hover:text-blue-700"
                      >
                        Adjust Balance
                      </GlassButton>
                      <button 
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {bots.map((bot) => (
             <div key={bot.id} className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <h4 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {bot.name}
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded-md font-medium text-slate-500">{bot.model_name}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Owner: {bot.users?.email}</p>
                   </div>
                   <ShieldCheck className="w-4 h-4 text-blue-500" />
                </div>
                
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/10">
                   <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Instructions (System Prompt)</p>
                   <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed italic line-clamp-6">
                      "{bot.system_prompt || 'No instructions provided.'}"
                   </p>
                </div>

                <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50 dark:border-white/5">
                   <span className="text-[11px] text-slate-400">Created: {new Date(bot.created_at).toLocaleDateString()}</span>
                   <GlassButton className="text-[11px] h-7">Audit Chat Logs</GlassButton>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* System Health */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5 flex gap-4">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="flex flex-col gap-1">
          <h4 className="text-[13px] font-semibold text-amber-900 dark:text-amber-200">Admin Safety Reminder</h4>
          <p className="text-[12px] text-amber-700 dark:text-amber-400">Adjusting tokens or suspending accounts will notify users immediately. Proceed with caution when using manual overrides.</p>
        </div>
      </div>

    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-5 rounded-2xl shadow-sm hover:translate-y-[-2px] transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
          <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[22px] font-bold text-slate-900 dark:text-white tabular-nums">{value}</span>
        <span className="text-[12px] text-slate-500 font-medium">{label}</span>
      </div>
    </div>
  );
}
