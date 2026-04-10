"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/dashboard/LanguageSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Dashboard');
  
  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] ltr:left-[-5%] rtl:right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] ltr:right-[-5%] rtl:left-[-5%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full" />

      {/* Header / Logo */}
      <div className="absolute top-8 ltr:left-8 rtl:right-8 flex items-center gap-2.5">
           <div className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
           </div>
           <span className="text-[16px] font-semibold tracking-tight text-slate-900 dark:text-white">{t('brand_name')}</span>
      </div>

      <div className="absolute top-8 ltr:right-8 rtl:left-8">
        <LanguageSwitcher />
      </div>

      <main className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>

      {/* Footer */}
      <div className="mt-12 text-[12px] text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} {t('brand_name')}. All rights reserved.
      </div>
    </div>
  );
}
