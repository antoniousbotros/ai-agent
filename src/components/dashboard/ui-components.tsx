import React from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

export function DashboardCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function StatCard({ label, state = "neutral" }: { label: string; state?: "positive" | "neutral" }) {
  return (
    <DashboardCard className="p-5 flex flex-col gap-4 hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.1)] transition-shadow">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="flex gap-4 items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24 bg-slate-100 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", state === "positive" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400")}>
              Label
            </span>
            <Skeleton className="h-3 w-12 dark:bg-slate-800" />
          </div>
        </div>
        
        {/* Mini Chart Dummy */}
        <div className="flex items-end gap-1 h-10 w-20 scale-y-110">
          <div className="w-1/4 bg-blue-100 dark:bg-blue-900/50 rounded-t-sm h-1/3"></div>
          <div className="w-1/4 bg-blue-200 dark:bg-blue-800/50 rounded-t-sm h-2/3"></div>
          <div className="w-1/4 bg-primary rounded-t-sm h-full"></div>
          <div className="w-1/4 bg-blue-100 dark:bg-blue-900/50 rounded-t-sm h-1/2"></div>
        </div>
      </div>
    </DashboardCard>
  );
}

export function SidebarItem({ icon: Icon, label, active }: { icon: React.ElementType, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
      active ? "bg-primary/5 text-primary shadow-sm shadow-primary/5" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
    )}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

export function ProgressCircle({ title }: { title: string }) {
  return (
    <DashboardCard className="p-6 flex flex-col justify-between h-full min-h-[300px]">
      <div className="text-sm font-medium text-slate-600 dark:text-slate-300 flex justify-between items-center mb-6">
        {title}
        <div className="p-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
        </div>
      </div>
      <div className="relative flex items-center justify-center flex-1 py-4">
        <svg viewBox="0 0 100 50" className="w-full max-w-[200px] overflow-visible drop-shadow-md">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" strokeLinecap="round" />
          <path d="M 10 50 A 40 40 0 0 1 70 15" fill="none" className="stroke-primary" strokeWidth="12" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-2">
          <Skeleton className="h-10 w-24 mb-3 bg-slate-100 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Label</span>
            <Skeleton className="h-3 w-16 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

export function ChartContainer() {
  return (
    <DashboardCard className="p-6 col-span-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">Title Placeholder</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Subtitle Placeholder</div>
        </div>
        <div className="flex flex-wrap gap-4 lg:gap-6 items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><div className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-800"></div>Label</div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><div className="w-3 h-3 rounded bg-orange-200 dark:bg-orange-800"></div>Label</div>
          </div>
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 text-xs font-semibold text-slate-500">
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm">Label 1</button>
            <button className="px-3 py-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Label 2</button>
            <button className="px-3 py-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Label 3</button>
          </div>
        </div>
      </div>
      
      <div className="relative h-[250px] w-full flex items-end justify-between px-2 sm:px-6 pb-6 border-b border-slate-100 dark:border-slate-800">
         {/* Y-axis rough */}
         <div className="absolute ltr:left-0 rtl:right-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 font-medium">
           <span>$1.2k</span><span>$1k</span><span>$800</span><span>$600</span><span>$400</span><span>$200</span><span>0</span>
         </div>
         {/* Horizontal grid lines */}
         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none ltr:ml-10 rtl:mr-10">
           {[1,2,3,4,5,6,7].map(i => (
             <div key={i} className="w-full border-b border-slate-100/80 dark:border-slate-800/80 border-dashed"></div>
           ))}
         </div>
         {/* Bars dummy */}
         <div className="flex items-end justify-between w-full h-full ltr:ml-10 rtl:mr-10 relative z-10 pt-4">
             {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((label, idx) => (
               <div key={idx} className="flex flex-col items-center gap-3 relative group w-6 sm:w-10">
                 <div className="flex gap-1 h-full items-end justify-center w-full relative">
                    <div className="w-2 sm:w-2.5 bg-orange-400 rounded-t-sm transition-all group-hover:bg-orange-500" style={{height: `${Math.random() * 40 + 10}%`}}></div>
                    <div className="w-2 sm:w-2.5 bg-primary rounded-t-sm transition-all group-hover:bg-blue-600 shadow-sm" style={{height: `${Math.random() * 60 + 20}%`}}></div>
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none flex flex-col gap-1.5 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl z-20 min-w-28 text-left rtl:text-right scale-95 group-hover:scale-100 origin-bottom">
                       <div className="flex justify-between items-center w-full gap-4">
                         <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div>Label</div>
                         <Skeleton className="w-8 h-3 bg-slate-700" />
                       </div>
                       <div className="flex justify-between items-center w-full gap-4">
                         <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div>Label</div>
                         <Skeleton className="w-8 h-3 bg-slate-700" />
                       </div>
                    </div>
                 </div>
                 <span className="text-xs font-medium text-slate-400 mt-2">{label}</span>
               </div>
             ))}
         </div>
      </div>
    </DashboardCard>
  );
}

export function GhostButton({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <button className="p-2.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50">
      <Icon className="w-5 h-5"/>
    </button>
  );
}

export function DropdownPlaceholder({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm">
      {label}
      <ChevronDown className="w-4 h-4 text-slate-400" />
    </button>
  );
}
