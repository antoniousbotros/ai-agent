import { 
  SidebarItem, GlassButton, PremiumDropdown 
} from "@/components/dashboard/ui-components";
import { 
  BarChart3, Bot, Key, Settings, 
  LogOut, Plus, Search,
  Zap, Database, Code, CreditCard, Network, MessageSquare, ShieldAlert
} from "lucide-react";
import { useTranslations } from "next-intl";

import OverviewTab from "@/components/dashboard/OverviewTab";
import UsageLogsTab from "@/components/dashboard/UsageLogsTab";
import ApiKeysTab from "@/components/dashboard/ApiKeysTab";
import MyBotsTab from "@/components/dashboard/MyBotsTab";
import EmbedTab from "@/components/dashboard/EmbedTab";
import BillingTab from "@/components/dashboard/BillingTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import IntegrationsTab from "@/components/dashboard/IntegrationsTab";
import LanguageSwitcher from "@/components/dashboard/LanguageSwitcher";
import ChatHistoryTab from "@/components/dashboard/ChatHistoryTab";
import SuperAdminTab from "@/components/dashboard/SuperAdminTab";
import { getUserProfile } from "../../actions";
import { supabase } from "@/lib/supabase";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const tab = typeof params.tab === 'string' ? params.tab : 'overview';
  const profile = await getUserProfile();

  return <DashboardContent activeTab={tab} profile={profile} />;
}

function DashboardContent({ activeTab, profile }: { activeTab: string, profile: any }) {
  const t = useTranslations('Dashboard');
  const isAdmin = profile?.role === 'admin';

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'usage': return <UsageLogsTab />;
      case 'bots': return <MyBotsTab />;
      case 'keys': return <ApiKeysTab />;
      case 'embed': return <EmbedTab />;
      case 'billing': return <BillingTab />;
      case 'profile': return <ProfileTab />;
      case 'integrations': return <IntegrationsTab />;
      case 'history': return <ChatHistoryTab />;
      case 'super-admin': return <SuperAdminTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fafafa] dark:bg-[#0a0a0a] font-sans overflow-hidden">
      
      {/* Ultra Minimal Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#fafafa] dark:bg-[#0a0a0a] ltr:border-r rtl:border-l border-slate-200/60 dark:border-white/10 shrink-0 h-full p-4 z-20">
        {/* Logo Area */}
        <div className="h-[60px] flex items-center px-2 shrink-0 mb-4 cursor-pointer">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-slate-900 dark:text-white">{t('brand_name')}</span>
          </div>
        </div>

        {/* Global Search */}
        <div className="px-1 mb-6">
          <div className="relative group">
            <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              className="w-full bg-transparent border border-slate-200/60 dark:border-white/10 text-[13px] font-medium rounded-lg ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2 outline-none focus:border-slate-400 placeholder:text-slate-400 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            />
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-1 space-y-6 scrollbar-hide pb-6">
          {isAdmin && (
            <div className="space-y-0.5" dir="auto">
              <div className="px-2 text-[11px] font-medium text-blue-500 mb-2 ltr:text-left rtl:text-right uppercase tracking-wider">System Control</div>
              <SidebarItem href="?tab=super-admin" icon={ShieldAlert} label="Super Admin" active={activeTab === 'super-admin'} />
            </div>
          )}

          <div className="space-y-0.5" dir="auto">
            <div className="px-2 text-[11px] font-medium text-slate-400 mb-2 ltr:text-left rtl:text-right uppercase tracking-wider">{t('menu_gateway')}</div>
            <SidebarItem href="?tab=overview" icon={BarChart3} label={t('overview')} active={activeTab === 'overview'} />
            <SidebarItem href="?tab=usage" icon={Database} label={t('usage_logs')} active={activeTab === 'usage'} />
            <SidebarItem href="?tab=history" icon={MessageSquare} label={t('menu_history')} active={activeTab === 'history'} />
          </div>

          <div className="space-y-0.5" dir="auto">
            <div className="px-2 text-[11px] font-medium text-slate-400 mb-2 mt-4 ltr:text-left rtl:text-right uppercase tracking-wider">{t('menu_config')}</div>
            <SidebarItem href="?tab=bots" icon={Bot} label={t('my_chatbots')} active={activeTab === 'bots'} />
            <SidebarItem href="?tab=keys" icon={Key} label={t('api_keys')} active={activeTab === 'keys'} />
            <SidebarItem href="?tab=integrations" icon={Network} label={t('menu_integrations')} active={activeTab === 'integrations'} />
            <SidebarItem href="?tab=embed" icon={Code} label={t('embed_widget')} active={activeTab === 'embed'} />
            <SidebarItem href="?tab=billing" icon={CreditCard} label={t('menu_billing')} active={activeTab === 'billing'} />
          </div>
        </div>

        {/* Profile / Logout */}
        <div className="mt-auto px-1">
           <a href="?tab=profile" className="flex items-center justify-between px-2 py-2 mb-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2.5">
                 <div className="w-7 h-7 rounded-sm bg-slate-200 dark:bg-white/10 flex items-center justify-center font-medium text-slate-700 dark:text-white text-[12px]">{profile?.full_name ? profile.full_name[0] : 'U'}</div>
                 <div className="flex flex-col">
                   <span className="text-[13px] font-medium text-slate-900 dark:text-white leading-none truncate max-w-[120px]">{profile?.full_name || t('menu_profile')}</span>
                 </div>
              </div>
              <Settings className="w-[16px] h-[16px] text-slate-400 shrink-0" />
           </a>
           <button 
             onClick={async () => {
               await supabase.auth.signOut();
               window.location.href = "/login";
             }}
             className="w-full flex items-center gap-2.5 px-2 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium text-[13px] rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
           >
             <LogOut className="w-[16px] h-[16px]"/> {t('logout')}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0a0a0a] rounded-tl-3xl md:ltr:border-l md:rtl:border-r border-t border-slate-200/60 dark:border-white/10 shadow-[-4px_4px_24px_rgba(0,0,0,0.02)]">
        
        <header className="h-[72px] flex items-center justify-between px-8 md:px-12 shrink-0 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200/60 flex items-center justify-center">
                <span className="text-[14px] font-semibold text-slate-900">R</span>
             </div>
             <h1 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                {activeTab === 'super-admin' ? "Super Admin System" : t('title_workspace')}
             </h1>
             <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium ltr:ml-2 rtl:mr-2">
                {isAdmin ? "Global Administrator" : t('pro_plan')}
             </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <PremiumDropdown label={t('project_name')} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 md:px-12 pt-8 pb-20">
          <div className="max-w-[1200px] mx-auto w-full">
             {renderContent()}
          </div>
        </div>
      </main>

    </div>
  );
}
