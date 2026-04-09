"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, Camera, Hash, MessageCircle, Settings, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function IntegrationsTab() {
  const t = useTranslations('Dashboard');
  const [connecting, setConnecting] = useState<string | null>(null);

  const integrations = [
    {
       id: "messenger",
       name: "Facebook Messenger",
       description: "Deploy your AI Agent directly to your Facebook Business Page. Automatically reply to customer DMs instantly.",
       icon: MessageSquare,
       color: "bg-blue-600",
       status: "available"
    },
    {
       id: "instagram",
       name: "Instagram Direct",
       description: "Connect to your Instagram Professional account to handle DMs, story replies, and customer acquisition.",
       icon: Camera,
       color: "bg-pink-600",
       status: "available"
    },
    {
       id: "whatsapp",
       name: "WhatsApp Business API",
       description: "Provide enterprise-grade support worldwide on WhatsApp. Requires a Meta Business API token.",
       icon: MessageCircle,
       color: "bg-emerald-500",
       status: "coming_soon"
    },
    {
       id: "slack",
       name: "Slack Workspace",
       description: "Bring your AI into Slack as a custom app. Answer internal team questions directly in channels.",
       icon: Hash,
       color: "bg-purple-600",
       status: "coming_soon"
    }
  ];

  const handleConnect = (id: string, name: string) => {
     setConnecting(name);
     setTimeout(() => {
        alert(`Oauth redirect to ${name} Developer console initiated.\n\n(This triggers the Webhook verification handshake to our fastify backend: /api/webhooks/${id})`);
        setConnecting(null);
     }, 1000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900 border-b border-transparent">{t('integrations_title') || "Omnichannel Integrations"}</h2>
          <p className="text-[14px] text-slate-500 mt-1">{t('integrations_subtitle') || "Connect your AI bots directly to social platforms and internal tools."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {integrations.map((app) => {
            const Icon = app.icon;
            const isAvailable = app.status === "available";

            return (
              <div key={app.name} className="bg-white rounded-[20px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-6 flex flex-col relative group">
                 <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-[14px] ${isAvailable ? app.color : 'bg-slate-300'} flex items-center justify-center shrink-0 shadow-inner`}>
                       <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-semibold text-slate-900">{app.name}</h3>
                          {!isAvailable && (
                             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Coming Soon</span>
                          )}
                       </div>
                       <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{app.description}</p>
                    </div>
                 </div>

                 <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                          <Settings className="w-4 h-4 text-slate-400" />
                       </div>
                       <span className="text-[12px] font-medium text-slate-500">Configure</span>
                    </div>

                    <button 
                       onClick={() => handleConnect(app.id, app.name)}
                       disabled={!isAvailable || connecting === app.name}
                       className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                          isAvailable 
                          ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                       }`}
                    >
                       {connecting === app.name ? (
                          "Connecting..."
                       ) : (
                          <>
                             <LinkIcon className="w-4 h-4" />
                             Connect App
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
