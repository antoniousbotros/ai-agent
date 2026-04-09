import { useTranslations } from "next-intl";
import { AIStatCard, SystemStatusCircle, InteractiveChart } from "./ui-components";
import { getServerAuthClient } from "@/lib/supabase-server";

export default async function OverviewTab() {
  const t = useTranslations('Dashboard');

  // Fetch Live Data
  const supabase = getServerAuthClient();
  const { data: usageLogs, error } = await supabase.from('usage').select('tokens_used, cost_incurred');
  
  let totalTokens = 0;
  let totalCost = 0;

  if (usageLogs && !error) {
     totalTokens = usageLogs.reduce((acc: number, log: any) => acc + (log.tokens_used || 0), 0);
     totalCost = usageLogs.reduce((acc: number, log: any) => acc + (Number(log.cost_incurred) || 0), 0);
  }

  // Format tokens dynamically
  const formattedTokens = totalTokens > 1000000 ? (totalTokens / 1000000).toFixed(1) + 'M' : totalTokens > 1000 ? (totalTokens / 1000).toFixed(1) + 'k' : totalTokens.toString();
  const formattedCost = "$" + totalCost.toFixed(2);

  return (
    <div className="w-full">
      {/* Top Grid Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* 6 Stats Cards Grid */}
          <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AIStatCard title={t('stat1_title')} value={usageLogs?.length.toString() || "0"} badge={t('stat1_badge')} isGlow />
            <AIStatCard title={t('stat2_title')} value={formattedTokens} badge={t('stat2_badge')} />
            <AIStatCard title={t('stat3_title')} value="1" badge={t('stat3_badge')} />
            
            <AIStatCard title={t('stat4_title')} value="45ms" badge={t('stat4_badge')} />
            <AIStatCard title={t('stat5_title')} value={formattedCost} badge={t('stat5_badge')} />
            <AIStatCard title={t('stat6_title')} value="0.00%" badge={t('stat6_badge')} />
          </div>

          {/* Right Side Arc Progress Card */}
          <div className="xl:col-span-1">
            <SystemStatusCircle />
          </div>

      </div>

      {/* Bottom Chart */}
      <div className="pb-12 mt-6">
          <InteractiveChart />
      </div>
    </div>
  );
}
