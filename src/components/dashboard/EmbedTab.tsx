"use client";

import { useTranslations } from "next-intl";
import { Code, Copy, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardData } from "@/app/actions";

export default function EmbedTab() {
  const t = useTranslations("Dashboard");
  const [copied, setCopied] = useState(false);
  const [testKey, setTestKey] = useState("YOUR_API_KEY");
  const [testBotId, setTestBotId] = useState("YOUR_BOT_ID");

  useEffect(() => {
    async function fetchIntegrationData() {
      const { keys, bots } = await getDashboardData();
      
      if (keys && keys.length > 0) setTestKey(keys[0].key_string);
      if (bots && bots.length > 0) setTestBotId(bots[0].id);
    }
    fetchIntegrationData();
  }, []);

  const codeString = `<script 
  src="${typeof window !== 'undefined' ? window.location.origin : 'https://rabeh.ai'}/widget.js" 
  data-key="${testKey}" 
  data-bot="${testBotId}"
  id="rabeh-widget-script">
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white ltr:text-left rtl:text-right">{t('embed_widget')}</h2>
        <p className="text-[14px] text-slate-500 mt-1 ltr:text-left rtl:text-right">{t('studio_logic_desc')}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200 dark:border-slate-800 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center">
                     <Code className="text-emerald-500 w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t('studio_logic_title')}</h3>
                  </div>
              </div>
              <button 
                 onClick={handleCopy}
                 className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Done" : "Copy Code"}
              </button>
         </div>
         
         <div className="p-6 bg-[#0f172a]" dir="ltr">
              <pre className="text-[13px] text-blue-300 font-mono overflow-x-auto">
                  <code>{codeString}</code>
              </pre>
         </div>
      </div>
    </div>
  );
}
