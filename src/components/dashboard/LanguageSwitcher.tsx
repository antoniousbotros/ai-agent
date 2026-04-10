"use client";

import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    const currentLocales = ['/en', '/ar'];
    let newPath = pathname;
    
    for (const loc of currentLocales) {
       if (pathname.startsWith(loc)) {
          newPath = pathname.replace(loc, `/${newLocale}`);
          break;
       }
    }
    
    // Quick routing fix using window.location to preserve searchParams ?tab=XXX
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = newPath;
    window.location.replace(currentUrl.toString());
  };

  // Safe default check since this might run during initial hydration
  const isAr = pathname?.startsWith('/ar') || false;

  return (
    <div className="flex bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200/60 dark:border-white/10 shrink-0">
       <button 
         onClick={() => handleLanguageChange('en')}
         className={`px-3 py-1.5 text-[11px] font-bold tracking-wide rounded-md transition-all ${!isAr ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
       >
          EN
       </button>
       <button 
         onClick={() => handleLanguageChange('ar')}
         className={`px-3 py-1.5 text-[11px] font-bold tracking-wide rounded-md transition-all ${isAr ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
       >
          AR
       </button>
    </div>
  );
}
