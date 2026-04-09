"use client";

import { Bot, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardData, updateBotConfig, createNewBot, deleteBot } from "@/app/actions";

export default function MyBotsTab() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBots();
  }, []);

  async function loadBots() {
    const { bots } = await getDashboardData();
    if (bots) {
      setBots(bots);
    }
    setLoading(false);
  }

  const handleUpdateField = (id: string, field: string, value: string) => {
    setBots(bots.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSave = async (bot: any) => {
    setSavingIds(prev => ({ ...prev, [bot.id]: true }));
    await updateBotConfig(bot.id, bot.name, bot.system_prompt, bot.model_name);
    setSavingIds(prev => ({ ...prev, [bot.id]: false }));
    alert(`Saved ${bot.name} Securely!`);
  };

  const handleDelete = async (bot: any) => {
    const confirmDelete = window.confirm(`Are you sure you want to completely delete "${bot.name}"?`);
    if(!confirmDelete) return;
    
    setDeletingIds(prev => ({ ...prev, [bot.id]: true }));
    await deleteBot(bot.id);
    await loadBots();
    setDeletingIds(prev => ({ ...prev, [bot.id]: false }));
  };

  const handleCreateNew = async () => {
    setCreating(true);
    const res = await createNewBot();
    if(res.success) {
      await loadBots();
    } else {
      alert("Failed to create bot: " + (res.error?.message || 'DB Error'));
    }
    setCreating(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900">My Chatbots</h2>
          <p className="text-[14px] text-slate-500 mt-1">Configure your AI persona and logic.</p>
        </div>
        <button 
           onClick={handleCreateNew}
           disabled={creating || loading}
           className="bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
           {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
           Create New Bot
        </button>
      </div>

      {loading ? (
        <p className="text-[14px] text-slate-500">Loading your bots...</p>
      ) : bots.length === 0 ? (
        <p className="text-[14px] text-slate-500">No bots found.</p>
      ) : (
        <div className="space-y-6">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-white rounded-[16px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <Bot className="text-blue-500 w-5 h-5" />
                       </div>
                       <div>
                          <input 
                            type="text"
                            className="text-[15px] font-semibold text-slate-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-100 rounded px-1 w-64"
                            value={bot.name || ''}
                            onChange={(e) => handleUpdateField(bot.id, 'name', e.target.value)}
                          />
                          <p className="text-[12px] text-slate-500 font-mono mt-0.5 px-1 truncate w-64 md:w-auto">ID: {bot.id}</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-md">
                           <span className="text-[11px] font-medium text-slate-500">Model:</span>
                           <input 
                              type="text"
                              className="text-[11px] font-bold text-slate-700 bg-transparent border-none outline-none w-20 px-1"
                              value={bot.model_name || ''}
                              onChange={(e) => handleUpdateField(bot.id, 'model_name', e.target.value)}
                           />
                       </div>
                       <button 
                         onClick={() => handleDelete(bot)}
                         disabled={deletingIds[bot.id]}
                         className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                         title="Delete Bot"
                       >
                         {deletingIds[bot.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                       </button>
                   </div>
               </div>
               
               <div className="p-6 bg-[#fafafa] space-y-4">
                   <label className="block text-[13px] font-medium text-slate-700">System Prompt / Instructions</label>
                   <textarea 
                     value={bot.system_prompt || ''}
                     onChange={(e) => handleUpdateField(bot.id, 'system_prompt', e.target.value)}
                     className="w-full h-32 p-4 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none text-[13px] text-slate-700 font-mono shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
                   />
                   <div className="flex justify-end">
                      <button 
                        onClick={() => handleSave(bot)}
                        disabled={savingIds[bot.id] || deletingIds[bot.id]}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                          {savingIds[bot.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                          Save Changes
                      </button>
                   </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
