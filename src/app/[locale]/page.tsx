import {useTranslations} from 'next-intl';
import { 
  StatCard, SidebarItem, ProgressCircle, ChartContainer, 
  GhostButton, DropdownPlaceholder 
} from "@/components/dashboard/ui-components";
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, 
  HelpCircle, BarChart, FileBox, Megaphone, Settings, 
  LogOut, Plus, ShoppingBasket, RefreshCw, Bell, Search,
  Menu
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardPage() {
  // const t = useTranslations('Index'); // Using dummy labels instead per specific request
  
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 shrink-0 h-full">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 gap-3 pt-4">
          <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShoppingBasket className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">SaaS Logo</span>
        </div>

        {/* Scrollable Nav Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {/* Search Box */}
          <div className="relative px-2">
            <Search className="w-4 h-4 absolute ltr:left-5 rtl:right-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search placeholder" 
              className="w-full bg-slate-100/80 dark:bg-slate-800 text-sm rounded-xl ltr:pl-9 rtl:pr-9 ltr:pr-4 rtl:pl-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-1">
            <div className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Menu Placeholder</div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard Label" active />
          </div>

          <div className="space-y-1">
            <div className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Sub-menu Placeholder</div>
            <SidebarItem icon={ShoppingBag} label="Label Placeholder" />
            <SidebarItem icon={ShoppingCart} label="Label Placeholder" />
          </div>

          <div className="space-y-1">
            <div className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Accounts & Roles</div>
            <SidebarItem icon={Users} label="Label Placeholder" />
            <SidebarItem icon={HelpCircle} label="Label Placeholder" />
            <SidebarItem icon={BarChart} label="Label Placeholder" />
          </div>

          <div className="space-y-1 pb-4">
            <div className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Setup</div>
            <SidebarItem icon={FileBox} label="Label Placeholder" />
            <SidebarItem icon={Megaphone} label="Label Placeholder" />
          </div>
        </div>

        {/* Bottom Profile / Settings */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
           <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4 border border-slate-100 dark:border-slate-800">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-1 overflow-hidden">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-16 h-3" />
              </div>
           </div>
           <div className="space-y-1">
             <SidebarItem icon={Settings} label="Settings" />
             <SidebarItem icon={LogOut} label="Logout" />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-slate-50 dark:bg-slate-950 shrink-0 border-b border-transparent">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Drawer */}
            <Sheet>
               <SheetTrigger className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-200/50 rounded-lg">
                 <Menu className="w-6 h-6" />
               </SheetTrigger>
               <SheetContent side="left" className="w-[280px] p-0 border-r-0 bg-white flex flex-col h-full">
                  <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100 shrink-0">
                    <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                      <ShoppingBasket className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">SaaS Logo</span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarItem icon={ShoppingBag} label="Products" />
                    <SidebarItem icon={ShoppingCart} label="Orders" />
                    <SidebarItem icon={Users} label="Customers" />
                    <SidebarItem icon={Settings} label="Settings" />
                  </div>
               </SheetContent>
            </Sheet>

            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">Page Title</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1 ltr:mr-4 rtl:ml-4">
              <GhostButton icon={Plus} />
              <GhostButton icon={ShoppingCart} />
              <GhostButton icon={RefreshCw} />
              <GhostButton icon={Bell} />
            </div>
            <div className="flex items-center gap-3">
              <DropdownPlaceholder label="Label Placeholder" />
              <DropdownPlaceholder label="Label Placeholder" />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-24 md:pb-10">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {/* Welcome Head */}
            <div className="flex flex-col gap-1">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Title Placeholder</h2>
               <p className="text-slate-500 dark:text-slate-400">Subtitle Placeholder</p>
            </div>

            {/* Top Grid Area (Cards + Progress) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               
               {/* 6 Stats Cards Grid */}
               <div className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 <StatCard label="Label Placeholder" state="positive" />
                 <StatCard label="Label Placeholder" state="positive" />
                 <StatCard label="Label Placeholder" state="positive" />
                 <StatCard label="Label Placeholder" state="positive" />
                 <StatCard label="Label Placeholder" state="positive" />
                 <StatCard label="Label Placeholder" state="neutral" />
               </div>

               {/* Large Right Side Arc Progress Card */}
               <div className="lg:col-span-1 xl:col-span-1">
                 <ProgressCircle title="Title Placeholder" />
               </div>

            </div>

            {/* Bottom Chart */}
            <ChartContainer />

          </div>
        </div>
      </main>

      {/* Mobile Bottom Toolbar Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-around px-4 z-40 pb-safe">
        <a className="flex flex-col items-center gap-1 text-primary">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Products</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <BarChart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Reports</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </a>
      </nav>

    </div>
  );
}
