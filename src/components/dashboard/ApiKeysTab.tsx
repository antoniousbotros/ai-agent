"use client";

import { useTranslations } from "next-intl";
import { Key, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardData, generateApiKey } from "@/app/actions";

export default function ApiKeysTab() {
  const t = useTranslations('Dashboard');
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
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white ltr:text-left rtl:text-right">{t('key_title')}</h2>
        <p className="text-[14px] text-slate-500 mt-1 ltr:text-left rtl:text-right">{t('key_subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200 dark:border-slate-800 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center lg:items-start justify-between flex-col lg:flex-row gap-4">
             <div className="w-full ltr:text-left rtl:text-right">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white flex items-center gap-2 ltr:justify-start rtl:justify-start">
                   <Key className="w-4 h-4 text-emerald-500" /> 
                   {t('key_card_title')}
                </h3>
                <p className="text-[13px] text-slate-500 mt-1">{t('key_card_desc')}</p>
             </div>
             <button 
                 onClick={handleGenerate}
                 disabled={generating}
                 className="bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
             >
                 {generating && <Loader2 className="w-4 h-4 animate-spin" />}
                 {t('key_generate_btn')}
             </button>
         </div>
         
         <div className="p-6 bg-[#fafafa] dark:bg-slate-900/50 space-y-3">
             {loading ? <p className="text-[13px] text-slate-500">{t('key_loading')}</p> : keys.length === 0 ? <p className="text-[13px] text-slate-500">{t('key_empty')}</p> : keys.map((keyObj, idx) => (
             <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 max-w-xl ltr:flex-row rtl:flex-row">
                 <div className="flex-1 font-mono text-[13px] px-3 text-slate-700 dark:text-slate-300 ltr:text-left rtl:text-left overflow-x-auto overflow-hidden whitespace-nowrap scrollbar-hide">
                    {keyObj.key_string}
                 </div>
                 <button 
                   onClick={() => handleCopy(keyObj.key_string, idx)}
                   className="flex items-center justify-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors shrink-0"
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
