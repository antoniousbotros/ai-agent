"use client";

import { 
  Bot, Save, Loader2, Plus, Trash2, 
  Palette, Brain, Settings, Sparkles, 
  ChevronRight, Globe, Maximize2, Layout, Copy, Check, ShieldAlert,
  Zap, MessageSquare, Activity, ExternalLink, X, MoreHorizontal,
  FileText, Upload, Database, Info, FileSpreadsheet, Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  getDashboardData, updateBotConfig, createNewBot, deleteBot,
  getBotKnowledge, addKnowledgeFile, deleteKnowledgeFile, updateKnowledgeNotes 
} from "@/app/actions";
import { supabase } from "@/lib/supabase";
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

type KnowledgeFile = {
  id: string;
  file_name: string;
  file_type: string;
  notes: string;
  size_bytes: number;
  created_at: string;
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
  const [activeTab, setActiveTab ] = useState<'brain' | 'design' | 'logic' | 'knowledge'>('brain');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Knowledge state
  const [knowledge, setKnowledge] = useState<KnowledgeFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileNotes, setFileNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { loadBots(); }, []);

  async function loadBots() {
    const { bots } = await getDashboardData();
    if (bots) setBots(bots as BotData[]);
    setLoading(false);
  }

  const loadKnowledge = async (botId: string) => {
    const data = await getBotKnowledge(botId);
    setKnowledge(data as KnowledgeFile[]);
  };

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

  const handleFileUpload = async () => {
    if (!selectedFile || !editingBot) return;
    setUploading(true);
    
    const filePath = `knowledge/${editingBot.id}/${Date.now()}_${selectedFile.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('bot_knowledge')
      .upload(filePath, selectedFile);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { success } = await addKnowledgeFile(
      editingBot.id,
      selectedFile.name,
      filePath,
      selectedFile.type,
      fileNotes,
      selectedFile.size
    );

    if (success) {
      loadKnowledge(editingBot.id);
      setSelectedFile(null);
      setFileNotes("");
    }
    setUploading(false);
  };

  const handleDeleteFile = async (file: KnowledgeFile) => {
    if (!confirm("Delete this training data?")) return;
    await deleteKnowledgeFile(file.id);
    // Note: We should also delete from storage (omitted for brevity but recommended)
    if (editingBot) loadKnowledge(editingBot.id);
  };

  const updateNotes = async (id: string, notes: string) => {
    await updateKnowledgeNotes(id, notes);
    if (editingBot) loadKnowledge(editingBot.id);
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
       {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-white/5 rounded-[32px] animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-40">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-4">
         <div className="ltr:text-left rtl:text-right">
            <h2 className="text-[32px] md:text-[42px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-4">AI Agents</h2>
            <p className="text-[15px] text-slate-400 font-medium max-w-md">Your workspace for building, training, and deploying specialized AI assistants.</p>
         </div>
         <button 
           onClick={handleCreateNew}
           disabled={creating}
           className="h-[56px] px-8 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-[15px] flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
         >
           {creating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
           Create New Agent
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
                  <div className="w-16 h-16 rounded-[22px] flex items-center justify-center border border-slate-100 dark:border-white/5 bg-[#fafafa] dark:bg-black/20 shadow-inner group-hover:scale-95 transition-transform duration-500">
                     {bot.logo_url ? <img src={bot.logo_url} className="w-full h-full object-cover rounded-[22px]" /> : <Bot style={{ color: bot.primary_color }} size={28} />}
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
                     <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d0d0d] bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">K</div>)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 tracking-tighter">Knowledge Base active</span>
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => { setEditingBot(bot); setActiveTab('knowledge'); loadKnowledge(bot.id); }}
                    className="w-full h-[52px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group/btn"
                  >
                    Enter Laboratory <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
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
                          <span className="text-[11px] font-bold text-slate-400 tracking-wider">Laboratory Session</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setEditingBot(null)} className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><X size={24} /></button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                 {/* Sidebar Navigation */}
                 <div className="w-[320px] border-r border-slate-50 dark:border-white/5 p-10 space-y-12 shrink-0">
                    <nav className="space-y-1.5">
                       {[
                         {id: 'knowledge', label: 'Knowledge Base', icon: Database},
                         {id: 'brain', label: 'Bot Intelligence', icon: Brain},
                         {id: 'design', label: 'Visual Interface', icon: Palette},
                         {id: 'logic', label: 'Platform SDK', icon: Settings}
                       ].map(tab => (
                          <button 
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); if(tab.id === 'knowledge') loadKnowledge(editingBot.id); }}
                            className={cn(
                              "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-[14px] transition-all",
                              activeTab === tab.id ? "bg-black dark:bg-white text-white dark:text-black shadow-xl" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                          >
                            <tab.icon size={18} />
                            {tab.label}
                          </button>
                       ))}
                    </nav>

                    <div className="pt-8 border-t border-slate-50 dark:border-white/5 flex flex-col gap-8">
                       <div className="space-y-2">
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-2">Memory Usage</div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 w-1/3 rounded-full" />
                          </div>
                       </div>
                       <button onClick={() => { if(confirm("Delete bot?")) { deleteBot(editingBot.id); setEditingBot(null); loadBots(); } }} className="flex items-center gap-3 text-red-500 font-bold text-[13px] hover:text-red-600 px-5 transition-colors"><Trash2 size={16} /> Destroy Agent</button>
                    </div>
                 </div>

                 {/* Main Content Pane */}
                 <div className="flex-1 overflow-y-auto p-12 bg-[#fafafa] dark:bg-[#0d0d0d] scrollbar-hide">
                    <div className="max-w-3xl mx-auto">
                       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          
                          {activeTab === 'knowledge' && (
                             <div className="space-y-12">
                                {/* Knowledge Header */}
                                <div className="space-y-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><Brain size={24} /></div>
                                      <div>
                                         <h4 className="text-[20px] font-bold">Training Grounds</h4>
                                         <p className="text-[14px] text-slate-400 font-medium">Feed this agent with Excel spreadsheets, PDFs, and internal documents.</p>
                                      </div>
                                   </div>

                                   {/* File Uploader */}
                                   <div className="bg-white dark:bg-black rounded-[40px] border border-slate-200 dark:border-white/10 p-10 relative group/upload">
                                      <div className="flex flex-col items-center text-center">
                                         <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-slate-400 group-hover/upload:scale-110 transition-transform">
                                            {uploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                                         </div>
                                         <h5 className="text-[18px] font-bold mb-2">Upload training data</h5>
                                         <p className="text-[14px] text-slate-400 mb-8 max-w-sm font-medium">Drag & drop .pdf, .txt, or .xlsx files. Maximum file size: 50MB.</p>
                                         
                                         {selectedFile ? (
                                           <div className="w-full space-y-4 animate-in zoom-in-95">
                                              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
                                                 <div className="flex items-center gap-3">
                                                    <FileText size={20} className="text-blue-500" />
                                                    <span className="text-[14px] font-bold">{selectedFile.name}</span>
                                                 </div>
                                                 <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                                              </div>
                                              <textarea 
                                                value={fileNotes}
                                                onChange={(e) => setFileNotes(e.target.value)}
                                                placeholder="Add notes for this file (e.g., 'Internal pricing table 2024')"
                                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-[14px] font-medium outline-none focus:border-blue-500 h-24 resize-none"
                                              />
                                              <button 
                                                onClick={handleFileUpload}
                                                disabled={uploading}
                                                className="w-full h-14 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                                              >
                                                {uploading ? <Loader2 className="animate-spin" /> : <Database size={18} />}
                                                Inject Knowledge
                                              </button>
                                           </div>
                                         ) : (
                                           <input 
                                             type="file" 
                                             accept=".pdf,.txt,.xlsx,.csv"
                                             onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                             className="absolute inset-0 opacity-0 cursor-pointer" 
                                           />
                                         )}
                                      </div>
                                   </div>
                                </div>

                                {/* Current Knowledge List */}
                                <div className="space-y-6">
                                   <div className="flex items-center justify-between px-2">
                                      <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Active Intelligence Sources</span>
                                      <span className="text-[11px] font-bold text-blue-500">{knowledge.length} Sources Found</span>
                                   </div>

                                   {knowledge.length === 0 ? (
                                     <div className="py-12 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[40px] text-center text-slate-300 font-bold uppercase tracking-widest text-[12px]">
                                        Empty Reservoir
                                     </div>
                                   ) : (
                                     <div className="grid grid-cols-1 gap-4">
                                        {knowledge.map(file => (
                                          <div key={file.id} className="bg-white dark:bg-black border border-slate-200 dark:border-white/5 rounded-[32px] p-6 group/file hover:border-blue-500/30 transition-all">
                                             <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                   <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                                      {file.file_name.endsWith('.xlsx') ? <FileSpreadsheet className="text-emerald-500" /> : <FileText className="text-blue-500" />}
                                                   </div>
                                                   <div className="flex flex-col gap-1 pr-10 overflow-hidden">
                                                      <h6 className="text-[16px] font-bold truncate">{file.file_name}</h6>
                                                      <div className="flex items-center gap-3">
                                                         <span className="text-[11px] font-bold text-slate-400 uppercase">{(file.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                                                         <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                                         <span className="text-[11px] font-bold text-slate-400 uppercase">{new Date(file.created_at).toLocaleDateString()}</span>
                                                      </div>
                                                      <div className="mt-4 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 relative">
                                                         <input 
                                                           className="w-full bg-transparent text-[13px] font-medium text-slate-500 outline-none"
                                                           value={file.notes}
                                                           onChange={(e) => updateNotes(file.id, e.target.value)}
                                                           placeholder="Click to add context notes..."
                                                         />
                                                      </div>
                                                   </div>
                                                </div>
                                                <div className="flex flex-col gap-2 opacity-0 group-hover/file:opacity-100 transition-opacity">
                                                   <button className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"><Eye size={18} /></button>
                                                   <button onClick={() => handleDeleteFile(file)} className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                             </div>
                                          </div>
                                        ))}
                                     </div>
                                   )}
                                </div>
                             </div>
                          )}

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
                                   <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Core Directives</label>
                                   <textarea 
                                      rows={10}
                                      className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-5 text-[15px] font-medium leading-relaxed outline-none focus:border-black dark:focus:border-white transition-all shadow-sm resize-none"
                                      value={editingBot.system_prompt}
                                      onChange={(e) => setEditingBot({...editingBot, system_prompt: e.target.value})}
                                   />
                                </div>
                             </div>
                          )}

                          {activeTab === 'design' && (
                             <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                   <div className="space-y-4">
                                      <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Theme Color</label>
                                      <div className="flex items-center gap-4 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4">
                                         <input type="color" value={editingBot.primary_color} onChange={(e) => setEditingBot({...editingBot, primary_color: e.target.value})} className="w-10 h-10 cursor-pointer" />
                                         <span className="font-mono font-bold uppercase">{editingBot.primary_color}</span>
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                      <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest block">Appearance</label>
                                      <div className="flex bg-slate-100 p-1 rounded-2xl h-[56px]">
                                         <button onClick={() => setEditingBot({...editingBot, theme: 'light'})} className={cn("flex-1 rounded-xl text-[12px] font-bold", editingBot.theme === 'light' ? "bg-white text-black shadow" : "text-slate-400")}>Light</button>
                                         <button onClick={() => setEditingBot({...editingBot, theme: 'dark'})} className={cn("flex-1 rounded-xl text-[12px] font-bold", editingBot.theme === 'dark' ? "bg-white text-black shadow" : "text-slate-400")}>Dark</button>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}

                          {activeTab === 'logic' && (
                             <div className="bg-black text-white p-10 rounded-[40px] border border-white/10 shadow-2xl">
                                <h4 className="text-[20px] font-bold mb-3">Install Agent</h4>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 font-mono text-[12px] text-blue-400 mb-8 whitespace-pre" dir="ltr">
                                   {`<script\n  src="https://rabeh.ai/widget.js"\n  data-bot-id="${editingBot.id}">\n</script>`}
                                </div>
                                <button className="h-14 px-8 bg-white text-black rounded-full font-bold text-[14px]">Copy Script</button>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Preview Pane */}
                 <div className="w-[440px] border-l border-slate-50 dark:border-white/5 p-12 flex flex-col items-center justify-between bg-white dark:bg-black">
                    <div className="w-[300px] aspect-[1/2] rounded-[52px] border-[10px] border-slate-900 dark:border-[#1a1a1a] shadow-2xl relative overflow-hidden bg-white dark:bg-slate-950">
                        <div className="h-14 flex items-center px-6 gap-3" style={{ backgroundColor: editingBot.primary_color, color: 'white' }}>
                           <Bot size={18} />
                           <span className="text-[13px] font-bold truncate">{editingBot.name}</span>
                        </div>
                        <div className="flex-1 p-6 space-y-4">
                           <div className="bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl text-[11px] font-medium leading-relaxed">
                              Hello! I've been training on {knowledge.length} documents. How can I help you?
                           </div>
                        </div>
                    </div>

                    <div className="w-full pt-8 px-4 flex flex-col gap-4">
                       <button onClick={handleSave} disabled={saving} className="h-14 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-[15px] flex items-center justify-center gap-3">
                          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Sync Laboratory
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
