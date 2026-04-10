import React from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown, BarChart2 } from "lucide-react";
import { useTranslations } from 'next-intl';

export function DashboardCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200/60 dark:border-slate-800 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function AIStatCard({ title, value, badge, isGlow }: { title: string; value: string; badge: string; isGlow?: boolean }) {
  return (
    <DashboardCard className="p-6 flex flex-col justify-between h-[150px] transition-all hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)] hover:border-slate-200 dark:hover:border-slate-700">
      <div className="flex justify-between items-start">
        <div className="text-[13px] font-medium text-slate-500">{title}</div>
        {isGlow && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>}
      </div>
      <div>
        <div className="text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white mb-1 ltr:text-left rtl:text-right">{value}</div>
        <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 ltr:justify-start rtl:justify-end w-full">
           <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-md whitespace-nowrap">{badge}</span>
        </div>
      </div>
    </DashboardCard>
  );
}

import Link from 'next/link';

export function SidebarItem({ icon: Icon, label, active, href = "#" }: { icon: React.ElementType, label: string, active?: boolean, href?: string }) {
  return (
    <Link href={href} className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-[13px] outline-none",
      active ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 focus:bg-slate-50"
    )}>
      <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-slate-900 dark:text-white" : "text-slate-400")} strokeWidth={2} />
      <span className="flex-1 ltr:text-left rtl:text-right">{label}</span>
    </Link>
  );
}

export function SystemStatusCircle() {
  const t = useTranslations('Dashboard');
  return (
    <DashboardCard className="p-6 flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex justify-between items-start mb-6">
        <div className="ltr:text-left rtl:text-right">
          <div className="text-[14px] font-semibold text-slate-900 dark:text-white">{t('sys_title')}</div>
          <div className="text-[12px] text-slate-500 mt-1">{t('sys_subtitle')}</div>
        </div>
        <div className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md text-[11px] font-medium">{t('sys_status')}</div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center mt-4">
        <svg viewBox="0 0 100 50" className="w-full max-w-[200px] overflow-visible">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" strokeLinecap="round" />
          <path d="M 10 50 A 40 40 0 0 1 65 20" fill="none" className="stroke-blue-500" strokeWidth="8" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
          <div className="text-[32px] font-semibold tracking-tight text-slate-900 dark:text-white">41<span className="text-[18px] text-slate-400 font-medium">ms</span></div>
          <div className="text-[12px] font-medium text-slate-500 mt-1">
            {t('sys_metric')}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

export function InteractiveChart() {
  const t = useTranslations('Dashboard');
  return (
    <DashboardCard className="p-6 col-span-full mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="ltr:text-left rtl:text-right">
          <div className="text-[14px] font-semibold text-slate-900 dark:text-white">{t('chart_title')}</div>
          <div className="text-[13px] font-medium text-slate-500 mt-1">{t('chart_subtitle')}</div>
        </div>
        <div className="flex items-center gap-2">
           <button className="text-[12px] font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors border border-slate-200/60 dark:border-slate-800">{t('chart_30d')}</button>
           <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"><BarChart2 className="w-[18px] h-[18px]" /></button>
        </div>
      </div>
      
      <div className="relative h-[200px] w-full flex items-end justify-between px-2 pb-2">
         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none ltr:ml-8 rtl:mr-8 h-[170px]">
           {[1,2,3,4].map(i => (
             <div key={i} className="w-full border-b border-slate-100 dark:border-slate-800 border-dashed"></div>
           ))}
         </div>
         
         <div className="flex items-end justify-between w-full h-[170px] ltr:ml-8 rtl:mr-8 relative z-10 pt-4" dir="ltr">
             {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", t('chart_now')].map((label, idx) => {
               const value1 = Math.max(10, Math.random() * 80 + 10);
               return (
               <div key={idx} className="flex flex-col items-center gap-3 relative group w-6 sm:w-10">
                 <div className="flex gap-2 h-full items-end justify-center w-full relative">
                    <div className="w-[18px] bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-500 rounded-sm transition-colors cursor-pointer" style={{height: `${value1}%`}}></div>
                 </div>
                 <span className="text-[11px] font-medium text-slate-400">{label}</span>
               </div>
             )})}
         </div>
      </div>
    </DashboardCard>
  );
}

export function GlassButton({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all bg-white dark:bg-slate-900 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <Icon className="w-[18px] h-[18px]"/>
    </button>
  );
}

export function PremiumDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-[0_2px_8_px_rgba(0,0,0,0.02)]">
      {label}
      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
    </button>
  );
}
