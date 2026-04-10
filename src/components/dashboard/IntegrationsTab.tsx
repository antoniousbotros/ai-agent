"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, Camera, Hash, MessageCircle, Settings, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export default function IntegrationsTab() {
  const t = useTranslations('Dashboard');
  const [connecting, setConnecting] = useState<string | null>(null);

  const integrations = [
    {
       id: "messenger",
       name: t('int_messenger'),
       description: t('int_messenger_desc'),
       icon: MessageSquare,
       color: "bg-blue-600",
       status: "available"
    },
    {
       id: "instagram",
       name: t('int_instagram'),
       description: t('int_instagram_desc'),
       icon: Camera,
       color: "bg-pink-600",
       status: "available"
    },
    {
       id: "whatsapp",
       name: t('int_whatsapp'),
       description: t('int_whatsapp_desc'),
       icon: MessageCircle,
       color: "bg-emerald-500",
       status: "coming_soon"
    },
    {
       id: "slack",
       name: t('int_slack'),
       description: t('int_slack_desc'),
       icon: Hash,
       color: "bg-purple-600",
       status: "coming_soon"
    }
  ];

  const handleConnect = (id: string, name: string) => {
     setConnecting(name);
     setTimeout(() => {
        alert(`${name} - initiated.`);
        setConnecting(null);
     }, 1000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white">{t('integrations_title')}</h2>
          <p className="text-[14px] text-slate-500 mt-1">{t('integrations_subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {integrations.map((app) => {
            const Icon = app.icon;
            const isAvailable = app.status === "available";

            return (
              <div key={app.id} className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-6 flex flex-col relative group">
                 <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-[14px] ${isAvailable ? app.color : 'bg-slate-300 dark:bg-slate-800'} flex items-center justify-center shrink-0 shadow-inner`}>
                       <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">{app.name}</h3>
                          {!isAvailable && (
                             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{t('int_coming_soon')}</span>
                          )}
                       </div>
                       <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{app.description}</p>
                    </div>
                 </div>

                 <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <Settings className="w-4 h-4 text-slate-400" />
                       </div>
                       <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Config</span>
                    </div>

                    <button 
                       onClick={() => handleConnect(app.id, app.name)}
                       disabled={!isAvailable || connecting === app.name}
                       className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                          isAvailable 
                          ? 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                       }`}
                    >
                       {connecting === app.name ? t('int_connecting') : (
                          <>
                             <LinkIcon className="w-4 h-4" />
                             {t('int_connect')}
                          </>
                       )}
                    </button>
                 </div>
              </div>
            );
         })}
      </div>
    </div>
  );
}
