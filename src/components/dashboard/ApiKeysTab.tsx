"use client";

import { Key, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardData, generateApiKey } from "@/app/actions";

export default function ApiKeysTab() {
  const [keys, setKeys] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadKeys = async () => {
    setLoading(true);
    const { keys } = await getDashboardData();
    if (keys) {
      setKeys(keys);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadKeys();
  }, []);

  const handleCopy = (keyString: string, idx: number) => {
    navigator.clipboard.writeText(keyString);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const res = await generateApiKey();
    if(res.success) {
      await loadKeys();
    } else {
      alert("Failed to generate key: " + (res.error?.message || 'DB Error'));
    }
    setGenerating(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-[20px] font-semibold text-slate-900">API Keys</h2>
        <p className="text-[14px] text-slate-500 mt-1">Manage your secret keys to authenticate widget requests.</p>
      </div>

      <div className="bg-white rounded-[16px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center lg:items-start justify-between flex-col lg:flex-row gap-4">
             <div>
                <h3 className="text-[15px] font-semibold text-slate-900 flex items-center gap-2"><Key className="w-4 h-4 text-emerald-500" /> API Access Tokens</h3>
                <p className="text-[13px] text-slate-500 mt-1">Use these keys for your live widget integration.</p>
             </div>
             <button 
                 onClick={handleGenerate}
                 disabled={generating}
                 className="bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
             >
                 {generating && <Loader2 className="w-4 h-4 animate-spin" />}
                 Generate New Key
             </button>
         </div>
         
         <div className="p-6 bg-[#fafafa] space-y-3">
             {loading ? <p className="text-[13px] text-slate-500">Loading keys...</p> : keys.length === 0 ? <p className="text-[13px] text-slate-500">No API keys found or RLS is blocking access.</p> : keys.map((keyObj, idx) => (
             <div key={idx} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-1 max-w-xl">
                 <div className="flex-1 font-mono text-[13px] px-3 text-slate-700">{keyObj.key_string}</div>
                 <button 
                   onClick={() => handleCopy(keyObj.key_string, idx)}
                   className="flex items-center justify-center p-2 rounded-md hover:bg-slate-50 text-slate-500 transition-colors"
                 >
                     {copiedIndex === idx ? <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500" /> : <Copy className="w-[18px] h-[18px]" />}
                 </button>
             </div>
             ))}
         </div>
      </div>
    </div>
  );
}
