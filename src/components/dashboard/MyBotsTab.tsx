"use client";

import { 
  Bot, Save, Loader2, Plus, Trash2, 
  Palette, Brain, Settings, Sparkles, 
  ChevronRight, Globe, Maximize2, Layout, Copy, Check, ShieldAlert,
  Zap, MessageSquare, Activity, ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getDashboardData, updateBotConfig, createNewBot, deleteBot } from "@/app/actions";
import { cn } from "@/lib/utils";

type BotData = {
  id: string;
  name: string;
  model_name: string;
  system_prompt: string;
  primary_color: string;
  logo_url: string;
  position: string;
  theme: string;
};

// --- Sub-Component: Model Icon Component ---
const ModelIcon = ({ model }: { model: string }) => {
  if (model.includes('gemma')) return <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center border border-indigo-500/20"><Zap size={22} fill="currentColor" /></div>;
  if (model.includes('llama')) return <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20"><Brain size={22} /></div>;
  return <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-500/20"><Sparkles size={22} /></div>;
};

export default function MyBotsTab() {
  const t = useTranslations("Dashboard");
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBot, setEditingBot] = useState<BotData | null>(null);
  const [activeTab, setActiveTab ] = useState<'brain' | 'design' | 'logic'>('brain');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBots();
  }, []);

  async function loadBots() {
    const { bots } = await getDashboardData();
    if (bots) setBots(bots as BotData[]);
    setLoading(false);
  }

  const handleCreateNew = async () => {
    setCreating(true);
    const res = await createNewBot();
    if(res.success) await loadBots();
    setCreating(false);
  };

  const handleDelete = async (botId: string) => {
    if(!confirm("Delete this AI Agent?")) return;
    await deleteBot(botId);
    await loadBots();
    setEditingBot(null);
  };

  const handleSave = async () => {
    if (!editingBot) return;
    setSaving(true);
    await updateBotConfig(
      editingBot.id, 
      editingBot.name, 
      editingBot.system_prompt, 
      editingBot.model_name,
      editingBot.primary_color,
      editingBot.logo_url,
      editingBot.position,
      editingBot.theme
    );
    setSaving(false);
    loadBots();
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
       {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-white/5 rounded-[32px]"></div>)}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      
      {/* Header with Glass Gradient */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/40 dark:bg-white/5 p-8 rounded-[32px] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl shadow-sm">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Bot className="text-white" size={32} />
            </div>
            <div className="ltr:text-left rtl:text-right">
               <h2 className="text-[28px] font-bold text-slate-900 dark:text-white leading-tight">AI Agent Laboratory</h2>
               <p className="text-[14px] text-slate-500 font-medium">{t('studio_subtitle')}</p>
            </div>
         </div>
         <button 
           onClick={handleCreateNew}
           disabled={creating}
           className="h-[52px] px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-[14px] flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-xl"
         >
           {creating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
           Deploy New Agent
         </button>
      </div>

      {bots.length === 0 ? (
        <div className="py-32 text-center bg-white dark:bg-white/5 rounded-[40px] border border-dashed border-slate-200 dark:border-white/10">
           <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Plus size={40} />
           </div>
           <h3 className="text-[20px] font-bold text-slate-900 dark:text-white mb-2">Build your first Agent</h3>
           <p className="text-slate-500 max-w-xs mx-auto text-[14px] mb-8 leading-relaxed">Choose a model, customize the intelligence, and deploy to your website in minutes.</p>
           <button onClick={handleCreateNew} className="text-blue-500 font-bold hover:underline flex items-center gap-2 mx-auto">Click here to start <ArrowRight size={16} /></button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div 
              key={bot.id} 
              className="group relative bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-6 rounded-[32px] hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
            >
               {/* Model & Name Header */}
               <div className="flex items-start justify-between mb-8">
                  <ModelIcon model={bot.model_name} />
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                     Live
                  </div>
               </div>

               <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">{bot.name}</h3>
               <p className="text-[12px] text-slate-400 font-medium mb-6 uppercase tracking-tighter">{bot.model_name} Intelligence</p>

               {/* Quick Stats Grid */}
               <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                     <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tokens</p>
                     <p className="text-[14px] font-bold tabular-nums">1.2M</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                     <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Chats</p>
                     <p className="text-[14px] font-bold tabular-nums">4.8k</p>
                  </div>
               </div>

               {/* Prompt Snippet Overlay */}
               <div className="mt-4 p-4 bg-slate-50/50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 h-20 overflow-hidden relative">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">"{bot.system_prompt}"</p>
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-50 dark:from-black/20 to-transparent" />
               </div>

               {/* Action Buttons Float On Hover */}
               <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                     <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-slate-500" title="View History"><MessageSquare size={18} /></button>
                     <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-slate-500" title="Analytics"><Activity size={18} /></button>
                  </div>
                  <button 
                    onClick={() => { setEditingBot(bot); setActiveTab('brain'); }}
                    className="flex items-center gap-2 text-[13px] font-bold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Enter Lab <ChevronRight size={16} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Overlay */}
      {editingBot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#0d0d0d] w-full max-w-6xl h-[90vh] rounded-[40px] shadow-2xl border border-white/5 flex flex-col overflow-hidden relative">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-10 py-6 border-b border-slate-100 dark:border-white/5 shrink-0">
                 <div className="flex items-center gap-4">
                    <ModelIcon model={editingBot.model_name} />
                    <div className="flex flex-col">
                       <h3 className="text-[20px] font-bold text-slate-900 dark:text-white leading-none mb-1">{editingBot.name}</h3>
                       <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{editingBot.id}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setEditingBot(null)}
                   className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
                 >
                   <Plus className="rotate-45" size={24} />
                 </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                 {/* Sidebar Controls */}
                 <div className="w-[380px] border-r border-slate-100 dark:border-white/5 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                    {/* Inner Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl">
                       {(['brain', 'design', 'logic'] as const).map(t_id => (
                          <button 
                            key={t_id}
                            onClick={() => setActiveTab(t_id)}
                            className={cn("flex-1 py-2 text-[12px] font-bold capitalize rounded-xl transition-all", activeTab === t_id ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-400")}
                          >{t_id}</button>
                       ))}
                    </div>

                    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-500">
                       {activeTab === 'brain' && (
                          <>
                             <div className="space-y-3">
                                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Agent Name</label>
                                <input 
                                   className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-[15px] outline-none focus:border-blue-500 transition-all font-medium"
                                   value={editingBot.name}
                                   onChange={(e) => setEditingBot({...editingBot, name: e.target.value})}
                                />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Model Engine</label>
                                <div className="grid grid-cols-1 gap-2">
                                   {['gemma2-9b', 'llama3-70b', 'gpt-4o'].map(m => (
                                      <button 
                                        key={m}
                                        onClick={() => setEditingBot({...editingBot, model_name: m})}
                                        className={cn("w-full px-5 py-3 rounded-xl border text-[13px] font-bold text-left flex items-center justify-between group", editingBot.model_name === m ? "bg-blue-500/10 border-blue-500 text-blue-500" : "bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300")}
                                      >
                                         {m}
                                         <div className={cn("w-2 h-2 rounded-full", editingBot.model_name === m ? "bg-blue-500 shadow-[0_0_8px_blue]" : "bg-slate-200")} />
                                      </button>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Instruction Set (Personality)</label>
                                <textarea 
                                   className="w-full h-48 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-[14px] outline-none focus:border-blue-500 transition-all font-medium leading-relaxed resize-none"
                                   value={editingBot.system_prompt}
                                   onChange={(e) => setEditingBot({...editingBot, system_prompt: e.target.value})}
                                />
                             </div>
                          </>
                       )}

                       {activeTab === 'design' && (
                          <>
                            <div className="space-y-6">
                               <div className="space-y-3">
                                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Brand Color</label>
                                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                                     <input 
                                        type="color" 
                                        className="w-10 h-10 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden" 
                                        value={editingBot.primary_color}
                                        onChange={(e) => setEditingBot({...editingBot, primary_color: e.target.value})}
                                     />
                                     <span className="font-mono text-[14px] font-bold uppercase">{editingBot.primary_color}</span>
                                  </div>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Appearance</label>
                                  <div className="grid grid-cols-2 gap-3">
                                     <button onClick={() => setEditingBot({...editingBot, theme: 'light'})} className={cn("p-4 rounded-2xl border flex flex-col gap-2 items-center", editingBot.theme === 'light' ? "border-blue-500 bg-blue-500/5" : "border-slate-100 dark:border-white/5 opacity-50")}>
                                        <div className="w-full h-8 bg-white border border-slate-200 rounded-md" />
                                        <span className="text-[11px] font-bold">Light</span>
                                     </button>
                                     <button onClick={() => setEditingBot({...editingBot, theme: 'dark'})} className={cn("p-4 rounded-2xl border flex flex-col gap-2 items-center", editingBot.theme === 'dark' ? "border-blue-500 bg-blue-500/5" : "border-slate-100 dark:border-white/5 opacity-50")}>
                                        <div className="w-full h-8 bg-slate-900 border border-white/5 rounded-md" />
                                        <span className="text-[11px] font-bold">Dark</span>
                                     </button>
                                  </div>
                               </div>
                            </div>
                          </>
                       )}

                       {activeTab === 'logic' && (
                         <div className="space-y-6">
                            <div className="p-6 bg-slate-900 rounded-2xl border border-white/10 relative overflow-hidden">
                               <h4 className="text-white text-[14px] font-bold mb-2 flex items-center gap-2"><Layout size={16} className="text-blue-500" /> Platform Deployment</h4>
                               <p className="text-[11px] text-slate-400 leading-relaxed mb-4">Integrate this specific agent into your website using our optimized JS SDK.</p>
                               <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-blue-400 mb-4 whitespace-pre-wrap overflow-x-auto" dir="ltr">
                                  {`<script src="https://rabeh.ai/widget.js"\n data-bot-id="${editingBot.id}"></script>`}
                               </div>
                               <button className="w-full bg-blue-600 text-white py-3 rounded-xl text-[12px] font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                                  <Copy size={14} /> Copy JS ID
                               </button>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col gap-2">
                               <button className="w-full flex items-center justify-between p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                                  <span className="text-[12px] font-bold">Connect Messenger</span>
                                  <ExternalLink size={14} className="text-slate-400" />
                               </button>
                               <button className="w-full flex items-center justify-between p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                                  <span className="text-[12px] font-bold">Connect WhatsApp</span>
                                  <ExternalLink size={14} className="text-slate-400" />
                               </button>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Center Content: Laboratory Preview */}
                 <div className="flex-1 bg-[#fafafa] dark:bg-[#050505] p-12 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
                       {Array.from({length: 40}).map((_, i) => <div key={i} className="border-r border-slate-900 dark:border-white" />)}
                    </div>
                    
                    {/* Live Widget Preview */}
                    <div className="w-[360px] aspect-[1/2] rounded-[48px] border-[12px] border-slate-900 dark:border-slate-800 shadow-2xl relative overflow-hidden bg-white dark:bg-slate-900 animate-in zoom-in-95 duration-700">
                        {/* Mock header */}
                        <div className="h-16 flex items-center px-6 gap-3" style={{ backgroundColor: editingBot.primary_color, color: 'white' }}>
                           <Bot size={20} />
                           <span className="text-[14px] font-bold">{editingBot.name}</span>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                           <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none w-4/5 text-[13px] font-medium leading-relaxed">
                              Hello! I am your AI assistant. How can I help you today?
                           </div>
                           <div className="bg-blue-500 text-white p-4 rounded-2xl rounded-tr-none w-4/5 self-end text-[13px] font-medium leading-relaxed">
                              I want to automate my customer support.
                           </div>
                           <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none w-4/5 text-[13px] font-medium leading-relaxed">
                              I can help with that! I am powered by {editingBot.model_name}.
                           </div>
                        </div>
                        {/* Mock input */}
                        <div className="absolute bottom-10 left-6 right-6 h-12 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-full px-5 flex items-center justify-between shadow-inner">
                           <span className="text-[12px] text-slate-400">Type a message...</span>
                           <div className="w-8 h-8 rounded-full" style={{ backgroundColor: editingBot.primary_color }} />
                        </div>
                    </div>

                    <div className="absolute bottom-12 flex gap-4">
                       <button 
                         onClick={() => handleDelete(editingBot.id)}
                         className="h-14 px-6 bg-red-50 text-red-600 rounded-2xl font-bold text-[14px] flex items-center gap-2 hover:bg-red-100 transition-all"
                       >
                          <Trash2 size={18} /> Delete Agent
                       </button>
                       <button 
                         onClick={handleSave}
                         disabled={saving}
                         className="h-14 px-10 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-[14px] flex items-center gap-3 hover:shadow-2xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                       >
                          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                          Sync Configuration
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return <ChevronRight size={size} />;
}
