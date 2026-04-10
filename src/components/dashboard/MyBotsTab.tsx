"use client";

import { 
  Bot, Save, Loader2, Plus, Trash2, 
  Palette, Brain, Settings, Sparkles, 
  ChevronRight, Globe, Maximize2, Layout, Copy, Check, ShieldAlert
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

// --- Sub-Component: Live Widget Preview ---
function WidgetPreview({ bot }: { bot: BotData }) {
  const t = useTranslations("Dashboard");
  const isDark = bot.theme === 'dark';
  const isLeft = bot.position === 'bottom-left';
  const primaryColor = bot.primary_color || '#3b82f6';

  return (
    <div className="sticky top-6 w-full aspect-[4/5] max-w-[320px] mx-auto bg-slate-100 dark:bg-slate-900/50 rounded-3xl border-8 border-slate-900 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-800 rounded-full opacity-20"></div>
      
      <div className={cn(
        "absolute bottom-4 w-64 flex flex-col shadow-xl rounded-2xl border overflow-hidden transition-all duration-500",
        isLeft ? "left-4" : "right-4",
        isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="p-3 flex items-center gap-2" style={{ backgroundColor: primaryColor, color: 'white' }}>
           {bot.logo_url ? (
             <img src={bot.logo_url} className="w-5 h-5 rounded-full bg-white object-cover" />
           ) : (
             <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><Bot size={12}/></div>
           )}
           <span className="text-[11px] font-bold truncate">{bot.name}</span>
        </div>
        <div className="p-4 space-y-3 h-32 overflow-hidden">
           <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }}></div>
              <div className="space-y-1 w-full">
                 <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                 <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
           </div>
           <div className="flex justify-end gap-2">
              <div className="space-y-1 w-2/3">
                 <div className="h-2 bg-blue-100/50 dark:bg-blue-900/20 rounded w-full"></div>
                 <div className="h-2 bg-blue-100/50 dark:bg-blue-900/20 rounded w-3/4"></div>
              </div>
              <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0"></div>
           </div>
        </div>
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
           <div className="h-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex-1"></div>
           <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></div>
        </div>
      </div>

      <div className={cn(
        "absolute bottom-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white z-20 pointer-events-none transition-all duration-300",
        isLeft ? "left-4" : "right-4",
        "scale-75 translate-y-20 group-hover:translate-y-0 group-hover:scale-100 opacity-0 group-hover:opacity-100"
      )} style={{ backgroundColor: primaryColor }}>
         <Plus className="rotate-45" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
         <Maximize2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
         <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">{t('studio_preview_label')}</p>
         <p className="text-[10px] text-slate-400 mt-1">{t('studio_preview_desc')}</p>
      </div>
    </div>
  );
}

export default function MyBotsTab() {
  const t = useTranslations("Dashboard");
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'brain' | 'design' | 'logic'>('brain');
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBots();
  }, []);

  async function loadBots() {
    const { bots } = await getDashboardData();
    if (bots) setBots(bots as BotData[]);
    setLoading(false);
  }

  const handleUpdateField = (id: string, field: keyof BotData, value: string) => {
    setBots(bots.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSave = async (bot: BotData) => {
    setSavingIds(prev => ({ ...prev, [bot.id]: true }));
    await updateBotConfig(
      bot.id, 
      bot.name, 
      bot.system_prompt, 
      bot.model_name,
      bot.primary_color,
      bot.logo_url,
      bot.position,
      bot.theme
    );
    setSavingIds(prev => ({ ...prev, [bot.id]: false }));
  };

  const handleDelete = async (bot: BotData) => {
    if(!window.confirm(`Delete "${bot.name}"?`)) return;
    setDeletingIds(prev => ({ ...prev, [bot.id]: true }));
    await deleteBot(bot.id);
    await loadBots();
    setDeletingIds(prev => ({ ...prev, [bot.id]: false }));
  };

  const handleCreateNew = async () => {
    setCreating(true);
    const res = await createNewBot();
    if(res.success) await loadBots();
    setCreating(false);
  };

  const copyEmbedCode = (botId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rabeh.ai';
    const code = `<script src="${origin}/widget.js" data-bot-id="${botId}"></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400 animate-pulse">{t('studio_init')}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="ltr:text-left rtl:text-right">
          <div className="flex items-center gap-2 mb-2 ltr:justify-start rtl:justify-end">
            <div className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">{t('studio_engine_label')}</div>
          </div>
          <h2 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">{t('studio_title')}</h2>
          <p className="text-[14px] text-slate-500 mt-2">{t('studio_subtitle')}</p>
        </div>
        <button 
           onClick={handleCreateNew}
           disabled={creating}
           className="bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold text-[14px] flex items-center justify-center gap-2"
        >
           {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
           {t('studio_new_btn')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bots.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] p-20 text-center">
             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Bot className="text-slate-300 dark:text-slate-600" size={40} />
             </div>
             <h3 className="text-[20px] font-bold text-slate-900 dark:text-white">{t('studio_empty')}</h3>
             <p className="text-[14px] text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">{t('studio_empty_desc')}</p>
          </div>
        ) : bots.map((bot) => {
          const isExpanded = expandedId === bot.id;
          
          return (
            <div 
              key={bot.id} 
              className={cn(
                "group transition-all duration-500 ease-out bg-white dark:bg-slate-900/40 border rounded-[32px] overflow-hidden backdrop-blur-sm",
                isExpanded ? "border-slate-200 dark:border-slate-800 shadow-2xl ring-1 ring-slate-900/5" : "border-slate-100 dark:border-slate-800/50 hover:border-slate-200"
              )}
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : bot.id)}
                className="p-6 flex items-center justify-between cursor-pointer select-none"
              >
                 <div className="flex items-center gap-5">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-95 duration-500 overflow-hidden shadow-inner bg-white dark:bg-slate-900" 
                      style={{ borderColor: bot.primary_color + '30' }}
                    >
                       {bot.logo_url ? (
                         <img src={bot.logo_url} className="w-full h-full object-cover" />
                       ) : (
                         <Bot style={{ color: bot.primary_color }} size={28} />
                       )}
                    </div>
                    <div className="ltr:text-left rtl:text-right">
                       <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">{bot.name}</h3>
                       <p className="text-[12px] text-slate-400 font-medium uppercase tracking-tighter">{bot.model_name} Engine</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className={cn("hidden sm:block px-3 py-1 rounded-full text-[11px] font-bold border", bot.position === 'bottom-right' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800")}>
                       {bot.position === 'bottom-right' ? t('studio_pos_right') : t('studio_pos_left')}
                    </div>
                    <ChevronRight className={cn("w-5 h-5 text-slate-300 transition-transform duration-500", isExpanded ? "rotate-90 text-slate-900 dark:text-white" : "")} />
                 </div>
              </div>

              {isExpanded && (
                <div className="p-8 pt-2 border-t border-slate-50 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left Pane: Controls */}
                    <div className="lg:col-span-7 space-y-8">
                      {/* Tabs */}
                      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                        {[
                          { id: 'brain', icon: Brain, label: t('studio_tab_brain') },
                          { id: 'design', icon: Palette, label: t('studio_tab_design') },
                          { id: 'logic', icon: Settings, label: t('studio_tab_logic') }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all",
                              activeTab === tab.id ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            )}
                          >
                            <tab.icon size={16} />
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-6">
                        {activeTab === 'brain' && (
                          <div className="space-y-6 animate-in fade-in duration-300">
                             <div className="space-y-2">
                               <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-right block">{t('studio_field_name')}</label>
                               <input 
                                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                                 value={bot.name}
                                 onChange={(e) => handleUpdateField(bot.id, 'name', e.target.value)}
                               />
                             </div>
                             <div className="space-y-2">
                               <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-right block">{t('studio_field_prompt')}</label>
                               <textarea 
                                 rows={6}
                                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium leading-relaxed" 
                                 value={bot.system_prompt}
                                 onChange={(e) => handleUpdateField(bot.id, 'system_prompt', e.target.value)}
                               />
                             </div>
                             <div className="space-y-2">
                               <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-right block">{t('studio_field_model')}</label>
                               <select 
                                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-[14px] outline-none appearance-none cursor-pointer font-medium"
                                 value={bot.model_name}
                                 onChange={(e) => handleUpdateField(bot.id, 'model_name', e.target.value)}
                               >
                                 <option value="llama3">{t('studio_model_llama')}</option>
                                 <option value="gpt-4o">{t('studio_model_gpt')}</option>
                                 <option value="claude-3-sonnet">{t('studio_model_claude')}</option>
                               </select>
                             </div>
                          </div>
                        )}

                        {activeTab === 'design' && (
                          <div className="space-y-6 animate-in fade-in duration-300">
                             <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                 <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-right block">{t('studio_field_color')}</label>
                                 <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl h-[54px] items-center px-4">
                                    <input 
                                      type="color" 
                                      className="w-8 h-8 rounded-lg overflow-hidden border-none bg-transparent cursor-pointer"
                                      value={bot.primary_color}
                                      onChange={(e) => handleUpdateField(bot.id, 'primary_color', e.target.value)}
                                    />
                                    <span className="text-[13px] font-mono text-slate-500 uppercase">{bot.primary_color}</span>
                                 </div>
                               </div>
                               <div className="space-y-2">
                                 <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-right block">{t('studio_field_pos')}</label>
                                 <div className="flex p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl h-[54px]">
                                    <button 
                                      onClick={() => handleUpdateField(bot.id, 'position', 'bottom-left')}
                                      className={cn("flex-1 rounded-xl text-[11px] font-extrabold uppercase transition-all", bot.position === 'bottom-left' ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white" : "text-slate-400")}
                                    >L</button>
                                    <button 
                                      onClick={() => handleUpdateField(bot.id, 'position', 'bottom-right')}
                                      className={cn("flex-1 rounded-xl text-[11px] font-extrabold uppercase transition-all", bot.position === 'bottom-right' ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white" : "text-slate-400")}
                                    >R</button>
                                 </div>
                               </div>
                             </div>

                             <div className="space-y-2">
                               <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-right block">{t('studio_field_theme')}</label>
                               <div className="grid grid-cols-2 gap-4">
                                  <button 
                                    onClick={() => handleUpdateField(bot.id, 'theme', 'light')}
                                    className={cn("p-4 rounded-2xl border flex items-center gap-3 transition-all", bot.theme === 'light' ? "bg-white dark:bg-slate-800 border-blue-500 dark:border-blue-500 shadow-md" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60")}
                                  >
                                     <div className="w-4 h-4 rounded-full border border-slate-300 bg-white" />
                                     <span className="text-[13px] font-bold">{t('studio_theme_light')}</span>
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateField(bot.id, 'theme', 'dark')}
                                    className={cn("p-4 rounded-2xl border flex items-center gap-3 transition-all", bot.theme === 'dark' ? "bg-white dark:bg-slate-800 border-blue-500 dark:border-blue-500 shadow-md" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60")}
                                  >
                                     <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700" />
                                     <span className="text-[13px] font-bold">{t('studio_theme_dark')}</span>
                                  </button>
                               </div>
                             </div>

                             <div className="space-y-4">
                                <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-right block">{t('studio_field_logo')}</label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] p-8 text-center bg-slate-50/50 dark:bg-slate-950/20 group/upload hover:border-blue-400/50 transition-colors relative">
                                   {bot.logo_url ? (
                                     <div className="relative w-16 h-16 mx-auto mb-4 group/img">
                                        <img src={bot.logo_url} className="w-full h-full rounded-2xl object-cover shadow-lg" />
                                        <button 
                                          onClick={() => handleUpdateField(bot.id, 'logo_url', '')}
                                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                        ><Trash2 size={12}/></button>
                                     </div>
                                   ) : (
                                     <div className="relative w-16 h-16 mx-auto mb-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300">
                                        <Bot size={28} />
                                     </div>
                                   )}
                                   <p className="text-[12px] font-bold text-slate-500 mb-1">{t('studio_upload_label')}</p>
                                   <input 
                                     type="file" 
                                     accept="image/*"
                                     onChange={(e) => {
                                       const file = e.target.files?.[0];
                                       if(file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => handleUpdateField(bot.id, 'logo_url', reader.result as string);
                                          reader.readAsDataURL(file);
                                       }
                                     }}
                                     className="absolute inset-0 opacity-0 cursor-pointer"
                                   />
                                </div>
                             </div>
                          </div>
                        )}

                        {activeTab === 'logic' && (
                          <div className="space-y-8 animate-in fade-in duration-300">
                             <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group/logic shadow-2xl">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/logic:scale-110 transition-transform"><Globe size={120} /></div>
                                <h4 className="text-[18px] font-bold text-white flex items-center gap-2 mb-2"><Layout size={20} className="text-blue-400" /> {t('studio_logic_title')}</h4>
                                <p className="text-[13px] text-slate-400 mb-6 leading-relaxed">{t('studio_logic_desc')}</p>
                                
                                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 font-mono text-[11px] text-blue-300/80 mb-6 relative group/code overflow-x-auto" dir="ltr">
                                  {`<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://rabeh.ai'}/widget.js"`}<br/>
                                  {`  data-bot-id="${bot.id}">`}<br/>
                                  {`</script>`}
                                  <button 
                                    onClick={() => copyEmbedCode(bot.id)}
                                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10"
                                  >
                                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                  </button>
                                </div>

                                <button 
                                   onClick={() => copyEmbedCode(bot.id)}
                                   className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-2xl font-bold text-[13px] transition-all flex items-center justify-center gap-2"
                                >
                                   {t('studio_logic_copy')}
                                </button>
                             </div>

                             <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 bg-slate-50/50 dark:bg-slate-900/40 relative">
                                <div className="absolute top-4 right-4"><Sparkles className="text-blue-500 w-5 h-5 animate-pulse" /></div>
                                <h4 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2"><ShieldAlert size={18} className="text-slate-400" /> {t('studio_logic_locked')}</h4>
                                <p className="text-[13px] text-slate-500 leading-relaxed">{t('studio_logic_locked_desc')}</p>
                             </div>
                          </div>
                        )}
                      </div>

                      {/* Sticky Footer */}
                      <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                         <button 
                           onClick={() => handleDelete(bot)}
                           disabled={deletingIds[bot.id]}
                           className="flex items-center gap-2 text-[13px] font-bold text-red-500 hover:text-red-600 transition-colors"
                         >
                           {deletingIds[bot.id] ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 
                           {t('studio_btn_delete')}
                         </button>
                         <button 
                           onClick={() => handleSave(bot)}
                           disabled={savingIds[bot.id]}
                           className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-[13px] flex items-center gap-2 shadow-xl active:scale-95 transition-all"
                         >
                           {savingIds[bot.id] ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                           {t('studio_btn_save')}
                         </button>
                      </div>
                    </div>

                    {/* Right Pane: Preview */}
                    <div className="lg:col-span-5 relative">
                       <WidgetPreview bot={bot} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
