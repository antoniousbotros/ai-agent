"use client";

import { useTranslations } from "next-intl";
import { Check, CheckCircle2, Zap, Shield, Sparkles } from "lucide-react";

export default function BillingTab() {
  const t = useTranslations('Dashboard');

  const handleUpgrade = (tier: string) => {
    alert(`Upgrading to ${tier}... In a real app, this redirects to Stripe Checkout.`);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto space-y-8 pb-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">{t('billing_title')}</h2>
        <p className="text-[15px] text-slate-500 mt-2">{t('billing_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-8 flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]">
           <div className="mb-6">
               <h3 className="text-[18px] font-semibold text-slate-900">Starter</h3>
               <div className="mt-4 flex items-end gap-1">
                  <span className="text-[36px] font-bold tracking-tight text-slate-900">$29</span>
                  <span className="text-[14px] font-medium text-slate-500 mb-2">/mo</span>
               </div>
               <p className="text-[13px] text-slate-500 mt-2">Perfect for side projects and small startups testing AI.</p>
           </div>
           
           <div className="flex-1 space-y-4 mb-8">
               <div className="flex items-start gap-3">
                  <Check className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-700">1 AI Agent Bot</span>
               </div>
               <div className="flex items-start gap-3">
                  <Check className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-700">1,000 Messages / month</span>
               </div>
               <div className="flex items-start gap-3">
                  <Check className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-700">Standard API Latency</span>
               </div>
               <div className="flex items-start gap-3 opacity-50">
                  <Shield className="w-[18px] h-[18px] text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-500">"Powered by Rabeh AI" Badge</span>
               </div>
           </div>

           <button 
             onClick={() => handleUpgrade('Starter')}
             className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-900 text-[14px] font-semibold rounded-[12px] border border-slate-200 transition-colors"
           >
             Downgrade
           </button>
        </div>

        {/* Pro Plan (Active) */}
        <div className="bg-slate-900 rounded-[24px] border border-slate-800 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] p-8 flex flex-col relative transform md:-translate-y-4">
           {/* Glow Effect / Badge */}
           <div className="absolute -top-4 inset-x-0 flex justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1.5 shadow-lg">
                 <Sparkles className="w-3 h-3" /> Most Popular
              </div>
           </div>

           <div className="mb-6">
               <h3 className="text-[18px] font-semibold text-white">Pro</h3>
               <div className="mt-4 flex items-end gap-1">
                  <span className="text-[36px] font-bold tracking-tight text-white">$99</span>
                  <span className="text-[14px] font-medium text-slate-400 mb-2">/mo</span>
               </div>
               <p className="text-[13px] text-slate-400 mt-2">For growing businesses needing white-label AI features.</p>
           </div>
           
           <div className="flex-1 space-y-4 mb-8">
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-300">Up to 5 AI Agent Bots</span>
               </div>
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-300">10,000 Messages / month</span>
               </div>
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-300">Priority API Routing</span>
               </div>
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-white shrink-0 mt-0.5" />
                  <span className="text-[14px] font-medium text-white">Remove "Powered by" Watermark</span>
               </div>
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-white shrink-0 mt-0.5" />
                  <span className="text-[14px] font-medium text-white">Custom Widget Colors</span>
               </div>
           </div>

           <button 
             disabled
             className="w-full py-3 px-4 bg-white/10 text-white text-[14px] font-semibold rounded-[12px] border border-white/20 flex items-center justify-center gap-2 cursor-default"
           >
             <Check className="w-4 h-4" /> {t('plan_current')}
           </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-8 flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]">
           <div className="mb-6">
               <h3 className="text-[18px] font-semibold text-slate-900">Enterprise</h3>
               <div className="mt-4 flex items-end gap-1">
                  <span className="text-[36px] font-bold tracking-tight text-slate-900">Custom</span>
               </div>
               <p className="text-[13px] text-slate-500 mt-2">Dedicated infrastructure and custom integrations.</p>
           </div>
           
           <div className="flex-1 space-y-4 mb-8">
               <div className="flex items-start gap-3">
                  <Zap className="w-[18px] h-[18px] text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-700">Unlimited Bots & Volume</span>
               </div>
               <div className="flex items-start gap-3">
                  <Check className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-700">Custom RAG Vector Injection</span>
               </div>
               <div className="flex items-start gap-3">
                  <Check className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-700">Dedicated vLLM GPU Server</span>
               </div>
               <div className="flex items-start gap-3">
                  <Check className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[14px] text-slate-700">Slack & Email Support</span>
               </div>
           </div>

           <button 
             onClick={() => handleUpgrade('Enterprise')}
             className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-semibold rounded-[12px] transition-colors"
           >
             Contact Sales
           </button>
        </div>

      </div>
    </div>
  );
}
