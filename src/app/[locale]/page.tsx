"use client";

import { useTranslations } from "next-intl";
import { 
  Zap, ArrowRight, Shield, 
  MessageCircle, BarChart3, Globe,
  Cpu, Layout, Layers
} from "lucide-react";
import Link from "next/link";
import LanguageSwitcher from "@/components/dashboard/LanguageSwitcher";
import { GlassButton } from "@/components/dashboard/ui-components";

export default function LandingPage() {
  const t = useTranslations('Dashboard');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors selection:bg-blue-500 selection:text-white">
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
             </div>
             <span className="text-[18px] font-bold tracking-tight">{t('brand_name')}</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
             <a href="#features" className="text-[14px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
             <a href="#pricing" className="text-[14px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
             <a href="#enterprise" className="text-[14px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Enterprise</a>
          </div>

          <div className="flex items-center gap-4">
             <LanguageSwitcher />
             <Link href="/login" className="text-[14px] font-semibold hover:text-blue-500 transition-colors hidden sm:block">Login</Link>
             <Link href="/signup">
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-[14px] font-bold hover:opacity-90 transition-all flex items-center gap-2">
                   Get Started <ArrowRight className="w-4 h-4 ltr:rotate-0 rtl:rotate-180" />
                </button>
             </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 ltr:left-[20%] rtl:right-[20%] w-[60%] h-[40%] bg-blue-500/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 ltr:right-[10%] rtl:left-[10%] w-[40%] h-[30%] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-[12px] font-bold uppercase tracking-widest mb-8 border border-blue-500/10">
              <Zap className="w-3.5 h-3.5" /> Empowering Conversational AI
           </div>
           
           <h1 className="text-[48px] md:text-[84px] font-bold tracking-tight leading-[1.05] mb-8 max-w-4xl mx-auto">
              Smart Agents for <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Every Business</span>
           </h1>

           <p className="text-[18px] md:text-[20px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Deploy bilingual AI chatbots across Messenger, WhatsApp, and Web in minutes. Increase engagement and automate support with Google's Gemma models.
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                 <button className="h-[56px] px-8 bg-blue-600 text-white rounded-2xl text-[16px] font-bold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3">
                    Start Free Trial <ArrowRight className="w-5 h-5 ltr:rotate-0 rtl:rotate-180" />
                 </button>
              </Link>
              <button className="h-[56px] px-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[16px] font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                 Watch Platform Demo
              </button>
           </div>
        </div>

        {/* Dashboard Preview Frame */}
        <div className="max-w-6xl mx-auto mt-24 relative">
           <div className="relative bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10 shadow-[0_32px_120px_rgba(0,0,0,0.12)] p-2 md:p-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="bg-[#fafafa] dark:bg-[#0a0a0a] rounded-2xl overflow-hidden aspect-[16/9] relative border border-slate-100 dark:border-white/5">
                 {/* Mock UI */}
                 <div className="absolute top-0 left-0 w-full h-[60px] border-b border-slate-100 dark:border-white/5 flex items-center px-6 justify-between bg-white/50 dark:bg-black/20">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
                    </div>
                    <div className="h-6 w-32 bg-slate-200 dark:bg-white/10 rounded-full" />
                 </div>
                 <div className="p-8 flex gap-8">
                    <div className="w-1/4 h-64 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                    <div className="w-3/4 space-y-4">
                       <div className="h-40 w-full bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center justify-center">
                          <MessageCircle className="w-12 h-12 text-blue-500 opacity-20" />
                       </div>
                       <div className="grid grid-cols-3 gap-4">
                          <div className="h-24 bg-slate-100 dark:bg-white/5 rounded-xl" />
                          <div className="h-24 bg-slate-100 dark:bg-white/5 rounded-xl" />
                          <div className="h-24 bg-slate-100 dark:bg-white/5 rounded-xl" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 bg-[#fafafa] dark:bg-white/[0.02]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-[36px] font-bold mb-4 tracking-tight">Enterprise Infrastructure</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium">Built for scale, speed, and absolute reliability.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <FeatureCard 
                  icon={Cpu} 
                  title="Gemma 2 Inference" 
                  desc="Leverage the world's most capable open-source architecture for reasoning-heavy tasks." 
               />
               <FeatureCard 
                  icon={Globe} 
                  title="Native Bilingualism" 
                  desc="Optimized for English and Arabic (RTL) out of the box with Cairo typography." 
               />
               <FeatureCard 
                  icon={Layout} 
                  title="Omni-Channel" 
                  desc="One single backend to rule Messenger, WhatsApp, and your own Website." 
               />
               <FeatureCard 
                  icon={Shield} 
                  title="Self-Hosted Privacy" 
                  desc="Your data, your models. Fully compliant with enterprise security standards." 
               />
               <FeatureCard 
                  icon={BarChart3} 
                  title="Advanced Analytics" 
                  desc="Track every token, every lead, and every sentiment shift automatically." 
               />
               <FeatureCard 
                  icon={Layers} 
                  title="Custom Branding" 
                  desc="Whitelabel the widget with your own colors, fonts, and unique logo." 
               />
            </div>
         </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 px-6 border-y border-slate-100 dark:border-white/5">
         <div className="max-w-4xl mx-auto text-center italic">
            <p className="text-[24px] md:text-[32px] font-medium leading-relaxed mb-6">
               "Rabeh transformed our customer support overnight. We reduced response times by 90% while actually improving customer satisfaction scores."
            </p>
            <div className="flex items-center justify-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10" />
               <div className="text-left">
                  <p className="text-[14px] font-bold">Omar Al-Farsi</p>
                  <p className="text-[12px] text-slate-500 uppercase tracking-widest font-bold">CEO at TechOasis</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
         <h3 className="text-[32px] md:text-[56px] font-bold mb-8">Ready to deploy your first agent?</h3>
         <Link href="/signup">
            <button className="bg-blue-600 text-white px-10 py-5 rounded-full text-[18px] font-bold hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95">
               Get Started for Free
            </button>
         </Link>
         <p className="mt-6 text-slate-400 font-medium">No credit card required • Deploy in under 5 minutes</p>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 dark:border-white/5 text-center">
         <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md flex items-center justify-center">
               <Zap className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[16px] font-bold tracking-tight">{t('brand_name')}</span>
         </div>
         <p className="text-slate-400 text-[13px] font-medium">© {new Date().getFullYear()} Rabeh AI. All rights reserved.</p>
      </footer>

    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-blue-500/40 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-lg">
       <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
          <Icon className="w-6 h-6" />
       </div>
       <h4 className="text-[18px] font-bold mb-3">{title}</h4>
       <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
