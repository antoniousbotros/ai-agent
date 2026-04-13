"use client";

import { 
  Bot, Save, Loader2, Plus, Trash2, 
  Palette, Brain, Settings, Sparkles, 
  ChevronRight, Globe, Maximize2, Layout, Copy, Check, ShieldAlert,
  Zap, MessageSquare, Activity, ExternalLink, X, MoreHorizontal
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

const ModelTag = ({ model }: { model: string }) => {
  const isGemma = model.includes('gemma');
  const isLlama = model.includes('llama');
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
      isGemma ? "bg-indigo-50 text-indigo-500 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20" : 
      isLlama ? "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20" : 
      "bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20"
    )}>
      {model.split('-')[0]} Engine
    </span>
  );
};

export default function MyBotsTab() {
  const t = useTranslations("Dashboard");
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBot, setEditingBot] = useState<BotData | null>(null);
  const [activeTab, setActiveTab ] = useState<'brain' | 'design' | 'logic'>('brain');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBots(); }, []);

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

  const handleSave = async () => {
    if (!editingBot) return;
    setSaving(true);
    await updateBotConfig(editingBot.id, editingBot.name, editingBot.system_prompt, editingBot.model_name, editingBot.primary_color, editingBot.logo_url, editingBot.position, editingBot.theme);
    setSaving(false);
    loadBots();
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-white/5 rounded-[32px] animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-40">
      
      {/* Ultra Clean Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-4">
         <div className="ltr:text-left rtl:text-right">
            <h2 className="text-[32px] md:text-[42px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-4">My AI Agents</h2>
            <p className="text-[15px] text-slate-400 font-medium max-w-md">{t('studio_subtitle')}</p>
         </div>
         <button 
           onClick={handleCreateNew}
           disabled={creating}
           className="h-[56px] px-8 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-[15px] flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
         >
           {creating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
           Create New Bot
         </button>
      </div>

      {bots.length === 0 ? (
        <div className="py-40 text-center">
           <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 text-slate-200">
              <Bot size={32} />
           </div>
           <h3 className="text-[22px] font-bold text-slate-900 dark:text-white mb-3">No active agents yet</h3>
           <p className="text-slate-400 max-w-xs mx-auto text-[15px] mb-10 leading-relaxed font-medium">Configure your first AI employee and deploy it to your website.</p>
           <button onClick={handleCreateNew} className="h-12 px-6 border border-slate-200 dark:border-white/10 rounded-full font-bold text-[14px] hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Get Started</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
          {bots.map((bot) => (
            <div 
              key={bot.id} 
              className="group relative bg-white dark:bg-[#0d0d0d] border border-slate-100 dark:border-white/5 p-8 rounded-[40px] hover:border-slate-300 dark:hover:border-white/20 transition-all duration-700 shadow-[0_2px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_48px_rgba(0,0,0,0.04)]"
            >
               <div className="flex items-center justify-between mb-10">
                  <div 
                    className="w-16 h-16 rounded-[22px] flex items-center justify-center border border-slate-100 dark:border-white/5 bg-[#fafafa] dark:bg-black/20 shadow-inner group-hover:scale-95 transition-transform duration-500"
                  >
                     {bot.logo_url ? (
                       <img src={bot.logo_url} className="w-full h-full object-cover rounded-[22px]" />
                     ) : (
                       <Bot style={{ color: bot.primary_color }} size={28} />
                     )}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400"><MoreHorizontal size={18} /></button>
                  </div>
               </div>

               <div className="space-y-1 mb-10">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[20px] font-bold text-slate-900 dark:text-white truncate">{bot.name}</h3>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </div>
                  <ModelTag model={bot.model_name} />
               </div>

               <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-white/5">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1">Messages</span>
                        <span className="text-[16px] font-bold tabular-nums">1.4k</span>
                     </div>
                     <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1">Inference cost</span>
                        <span className="text-[16px] font-bold tabular-nums">$42.80</span>
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => { setEditingBot(bot); setActiveTab('brain'); }}
                    className="w-full h-[52px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group/btn"
                  >
                    Configure Agent <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal - The "Clean" Laboratory */}
      {editingBot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500 p-0 sm:p-6 md:p-12">
           <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-7xl h-full max-h-[900px] rounded-none sm:rounded-[48px] shadow-[0_0_120px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-white/10 flex flex-col overflow-hidden relative">
              
              {/* Header */}
              <div className="px-10 py-8 flex items-center justify-between shrink-0 border-b border-slate-50 dark:border-white/5">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center">
                       <Bot className="text-white dark:text-black" size={24} />
                    </div>
                    <div className="flex flex-col">
                       <h3 className="text-[24px] font-bold leading-none mb-2">{editingBot.name}</h3>
                       <div className="flex items-center gap-2">
                          <ModelTag model={editingBot.model_name} />
                          <span className="text-[11px] font-bold text-slate-400 tracking-wider">ID: {editingBot.id.substring(0,8)}...</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setEditingBot(null)} className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><X size={24} /></button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                 {/* Sidebar Navigation */}
                 <div className="w-[340px] border-r border-slate-50 dark:border-white/5 p-10 space-y-12 shrink-0">
                    <nav className="space-y-2">
                       {(['brain', 'design', 'logic'] as const).map(t_id => (
                          <button 
                            key={t_id}
                            onClick={() => setActiveTab(t_id)}
                            className={cn(
                              "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all",
                              activeTab === t_id ? "bg-black dark:bg-white text-white dark:text-black shadow-xl" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                          >
                            {t_id === 'brain' && <Brain size={20} />}
                            {t_id === 'design' && <Palette size={20} />}
                            {t_id === 'logic' && <Settings size={20} />}
                            <span className="capitalize">{t_id} Settings</span>
                          </button>
                       ))}
                    </nav>

                    <div className="pt-8 border-t border-slate-50 dark:border-white/5">
                       <button onClick={() => { if(confirm("Delete bot?")) { deleteBot(editingBot.id); setEditingBot(null); loadBots(); } }} className="flex items-center gap-3 text-red-500 font-bold text-[13px] hover:text-red-600 px-6 transition-colors font-sans"><Trash2 size={16} /> Delete Forever</button>
                    </div>
                 </div>

                 {/* Main Content Pane */}
                 <div className="flex-1 overflow-y-auto p-12 bg-[#fafafa] dark:bg-[#0d0d0d] scrollbar-hide">
                    <div className="max-w-2xl">
                       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          {activeTab === 'brain' && (
                             <div className="space-y-10">
                                <div className="space-y-4">
                                   <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Agent Identity</label>
                                   <input 
                                      className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-[16px] font-semibold outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                                      value={editingBot.name}
                                      onChange={(e) => setEditingBot({...editingBot, name: e.target.value})}
                                   />
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Intelligence Instructions</label>
                                   <textarea 
                                      rows={10}
                                      className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-5 text-[15px] font-medium leading-relaxed outline-none focus:border-black dark:focus:border-white transition-all shadow-sm resize-none"
                                      value={editingBot.system_prompt}
                                      onChange={(e) => setEditingBot({...editingBot, system_prompt: e.target.value})}
                                   />
                                   <p className="text-[12px] text-slate-400 font-medium italic">Describe exactly how this bot should talk and what knowledge it has access to.</p>
                                </div>
                             </div>
                          )}

                          {activeTab === 'design' && (
                             <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                   <div className="space-y-4">
                                      <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Primary Theme Color</label>
                                      <div className="flex items-center gap-4 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                                         <input type="color" value={editingBot.primary_color} onChange={(e) => setEditingBot({...editingBot, primary_color: e.target.value})} className="w-10 h-10 border-none bg-transparent cursor-pointer rounded-lg" />
                                         <span className="font-mono font-bold uppercase">{editingBot.primary_color}</span>
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                      <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Widget Position</label>
                                      <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl h-[56px]">
                                         <button onClick={() => setEditingBot({...editingBot, position: 'bottom-left'})} className={cn("flex-1 rounded-xl text-[12px] font-bold transition-all", editingBot.position === 'bottom-left' ? "bg-white dark:bg-slate-800 text-black dark:text-white shadow-md" : "text-slate-400")}>Left</button>
                                         <button onClick={() => setEditingBot({...editingBot, position: 'bottom-right'})} className={cn("flex-1 rounded-xl text-[12px] font-bold transition-all", editingBot.position === 'bottom-right' ? "bg-white dark:bg-slate-800 text-black dark:text-white shadow-md" : "text-slate-400")}>Right</button>
                                      </div>
                                   </div>
                                </div>

                                <div className="space-y-4">
                                   <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Base Theme</label>
                                   <div className="flex gap-4">
                                      <button onClick={() => setEditingBot({...editingBot, theme: 'light'})} className={cn("flex-1 p-6 rounded-[32px] border text-center transition-all", editingBot.theme === 'light' ? "border-black dark:border-white bg-white dark:bg-black shadow-xl" : "border-slate-100 dark:border-white/5 opacity-40")}>
                                         <span className="text-[14px] font-bold">Light Mode</span>
                                      </button>
                                      <button onClick={() => setEditingBot({...editingBot, theme: 'dark'})} className={cn("flex-1 p-6 rounded-[32px] border text-center transition-all", editingBot.theme === 'dark' ? "border-black dark:border-white bg-white dark:bg-black shadow-xl" : "border-slate-100 dark:border-white/5 opacity-40")}>
                                         <span className="text-[14px] font-bold">Dark Mode</span>
                                      </button>
                                   </div>
                                </div>
                             </div>
                          )}

                          {activeTab === 'logic' && (
                             <div className="space-y-10">
                                <div className="bg-black text-white p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group/logic">
                                   <div className="absolute top-0 right-0 p-10 text-white/5 group-hover:scale-110 transition-transform duration-1000"><Zap size={160} /></div>
                                   <h4 className="text-[20px] font-bold mb-3 flex items-center gap-2">Ready to Launch <ArrowRight size={20}/></h4>
                                   <p className="text-[14px] text-slate-400 mb-8 leading-relaxed font-medium">Embed this agent on any platform by adding this script to your site's header.</p>
                                   
                                   <div className="bg-white/5 p-6 rounded-2xl border border-white/5 font-mono text-[12px] text-blue-400 mb-8 overflow-x-auto whitespace-pre ltr:text-left rtl:text-right" dir="ltr">
                                      {`<script\n  src="https://rabeh.ai/widget.js"\n  data-bot-id="${editingBot.id}">\n</script>`}
                                   </div>
                                   
                                   <button className="h-14 px-8 bg-white text-black rounded-full font-bold text-[14px] flex items-center gap-3 hover:translate-y-[-2px] transition-all">
                                      <Copy size={18} /> Copy Installation Script
                                   </button>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Preview Pane - Cleanest Look */}
                 <div className="w-[480px] border-l border-slate-50 dark:border-white/5 p-12 flex flex-col items-center justify-between shrink-0 bg-white dark:bg-black">
                    <div className="text-center">
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Live Workspace Preview</span>
                    </div>

                    <div className="w-[320px] aspect-[1/2] rounded-[56px] border-[12px] border-slate-900 dark:border-[#1a1a1a] shadow-2xl relative overflow-hidden bg-white dark:bg-slate-950 flex flex-col">
                        <div className="h-16 flex items-center px-6 gap-3" style={{ backgroundColor: editingBot.primary_color, color: 'white' }}>
                           <Bot size={20} />
                           <span className="text-[14px] font-bold truncate">{editingBot.name}</span>
                        </div>
                        <div className="flex-1 p-6 space-y-4">
                           <div className="bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none w-[85%] text-[12px] font-medium leading-relaxed">
                              Hey! I'm {editingBot.name}. How can I assist you in English or Arabic today?
                           </div>
                           <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-none w-[80%] self-end text-[12px] font-medium leading-relaxed shadow-lg shadow-blue-500/10">
                              Show me the pricing for API tokens.
                           </div>
                        </div>
                        <div className="px-6 pb-12 flex items-center gap-3">
                           <div className="flex-1 h-12 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/5" />
                           <div className="w-12 h-12 rounded-full shadow-lg" style={{ backgroundColor: editingBot.primary_color }}></div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full pt-8">
                       <button onClick={handleSave} disabled={saving} className="flex-1 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-[15px] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Save Changes
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
