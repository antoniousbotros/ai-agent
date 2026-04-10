import { Database } from "lucide-react";
import { getServerAuthClient } from "@/lib/supabase-server";
import { getTranslations } from "next-intl/server";

export default async function UsageLogsTab() {
  const t = await getTranslations('Dashboard');
  const supabase = getServerAuthClient();
  const { data: usageLogs, error } = await supabase
    .from('usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  const logs = usageLogs || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white ltr:text-left rtl:text-right">{t('usage_title')}</h2>
        <p className="text-[14px] text-slate-500 mt-1 ltr:text-left rtl:text-right">{t('usage_subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200 dark:border-slate-800 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900 flex items-center justify-center">
                     <Database className="text-orange-500 w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t('usage_inf_title')}</h3>
                  </div>
              </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] ltr:text-left rtl:text-right" dir="auto">
               <thead className="bg-[#fafafa] dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-medium tracking-wide">
                   <tr>
                       <th className="px-6 py-4 font-medium ltr:text-left rtl:text-right">{t('usage_th_time')}</th>
                       <th className="px-6 py-4 font-medium ltr:text-left rtl:text-right">{t('usage_th_caller')}</th>
                       <th className="px-6 py-4 font-medium ltr:text-left rtl:text-right">{t('usage_th_model')}</th>
                       <th className="px-6 py-4 font-medium ltr:text-left rtl:text-right">{t('usage_th_tokens')}</th>
                       <th className="px-6 py-4 font-medium ltr:text-left rtl:text-right">{t('usage_th_cost')}</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                   {logs.length === 0 ? (
                       <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">{t('usage_empty')}</td></tr>
                   ) : logs.map((log: any, i: number) => (
                       <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                           <td className="px-6 py-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                           <td className="px-6 py-4 font-mono text-slate-500">Fastify API</td>
                           <td className="px-6 py-4"><span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md text-[11px] font-medium">gemma:2b</span></td>
                           <td className="px-6 py-4 font-mono font-medium">{log.tokens_used}</td>
                           <td className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-medium">${Number(log.cost_incurred).toFixed(4)}</td>
                       </tr>
                   ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
