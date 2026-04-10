"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { getChatTranscripts } from "@/app/actions";
import { Globe, MessageSquare, Camera, ChevronRight, Bot, Clock, Filter } from "lucide-react";

type Transcript = {
  id: string;
  bot_id: string;
  platform: string;
  query_text: string;
  ai_response: string;
  created_at: string;
  bots?: { name: string } | null;
};

const PLATFORM_META: Record<string, { labelId: string; icon: typeof Globe; color: string; bg: string }> = {
  web:       { labelId: "int_connect", icon: Globe,          color: "text-blue-600",   bg: "bg-blue-50"   },
  messenger: { labelId: "int_messenger", icon: MessageSquare,  color: "text-blue-500",   bg: "bg-blue-50"   },
  instagram: { labelId: "int_instagram", icon: Camera,         color: "text-pink-600",   bg: "bg-pink-50"   },
  default:   { labelId: "Unknown", icon: Bot,            color: "text-slate-500",  bg: "bg-slate-50"  },
};

export default function ChatHistoryTab() {
  const t = useTranslations("Dashboard");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selected, setSelected] = useState<Transcript | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterBot, setFilterBot] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getChatTranscripts();
      setTranscripts(data as Transcript[]);
      if (data.length > 0) setSelected(data[0] as Transcript);
    });
  }, []);

  // Platform label helper
  const getPLabel = (p: string) => {
    if(p === "web") return "Web Widget";
    if(p === "messenger") return t('int_messenger');
    if(p === "instagram") return t('int_instagram');
    return p;
  };

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return new Date(dateStr).toLocaleDateString();
  };

  const uniqueBots = Array.from(
    new Map(transcripts.map((t) => [t.bot_id, t.bots?.name ?? "Bot"])).entries()
  );
  const platforms = ["all", "web", "messenger", "instagram"];

  const filtered = transcripts.filter((t) => {
    const matchPlatform = filterPlatform === "all" || t.platform === filterPlatform;
    const matchBot = filterBot === "all" || t.bot_id === filterBot;
    return matchPlatform && matchBot;
  });

  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

  const groupLabel = (dateStr: string) => {
    const d = new Date(dateStr).toDateString();
    if (d === todayStr) return t('hist_today');
    if (d === yesterdayStr) return t('hist_yesterday');
    return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white ltr:text-left rtl:text-right">
            {t("history_title")}
          </h2>
          <p className="text-[13px] text-slate-500 mt-1 ltr:text-left rtl:text-right">
            {t("history_subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <Filter className="w-4 h-4" />
          <span className="font-medium">{filtered.length} {t('hist_count')}</span>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex items-center gap-2 mb-5 flex-wrap ltr:flex-row rtl:flex-row">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setFilterPlatform(p)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
              filterPlatform === p
                ? "bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-md"
                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            {p === "all" ? t('hist_all_platforms') : getPLabel(p)}
          </button>
        ))}

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        <select
          value={filterBot}
          onChange={(e) => setFilterBot(e.target.value)}
          className="text-[12px] font-medium border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 outline-none bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-all"
        >
          <option value="all">{t('hist_all_bots')}</option>
          {uniqueBots.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      {/* Dual Pane */}
      <div className="flex flex-col lg:flex-row h-[620px] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-[0_4px_32px_-8px_rgba(0,0,0,0.06)] overflow-hidden bg-white dark:bg-[#0f172a]">

        {/* Left: Inbox List */}
        <div className="w-full lg:w-[340px] shrink-0 ltr:border-r rtl:border-l border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ltr:text-left rtl:text-right block">{t('hist_inbox')}</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {isPending && (
              <div className="flex items-center justify-center h-32 text-slate-400 text-[13px]">{t('hist_loading')}</div>
            )}
            {!isPending && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-8 text-slate-400">
                <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-[14px] font-semibold text-slate-900 dark:text-white opacity-80">{t('hist_empty')}</p>
                <p className="text-[12px] mt-2 leading-relaxed">{t('hist_empty_desc')}</p>
              </div>
            )}
            {!isPending && filtered.map((item, idx) => {
              const isActive = selected?.id === item.id;
              const prevItem = filtered[idx - 1];
              const showDateLabel = !prevItem || groupLabel(prevItem.created_at) !== groupLabel(item.created_at);

              return (
                <div key={item.id}>
                  {showDateLabel && (
                    <div className="px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-50/60 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 ltr:text-left rtl:text-right">
                      {groupLabel(item.created_at)}
                    </div>
                  )}
                  <button
                    onClick={() => setSelected(item)}
                    className={`w-full text-left px-5 py-4.5 border-b border-slate-50 dark:border-slate-800 transition-all flex items-start gap-4 group ltr:flex-row rtl:flex-row ${
                      isActive ? "bg-slate-900 dark:bg-blue-600 text-white shadow-inner" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isActive ? "bg-white/10" : (PLATFORM_META[item.platform]?.bg || "bg-slate-100 dark:bg-slate-800")
                    }`}>
                      {(() => { const Icon = PLATFORM_META[item.platform]?.icon || Bot; return <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : (PLATFORM_META[item.platform]?.color || "text-slate-400")}`} />; })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[13px] font-bold truncate ltr:text-left rtl:text-right block ${isActive ? "text-white" : "text-slate-800 dark:text-slate-200"}`}>
                          {item.bots?.name || "Bot"}
                        </span>
                        <span className={`text-[10px] shrink-0 font-medium ${isActive ? "text-white/60" : "text-slate-400"}`}>
                          {timeAgo(item.created_at)}
                        </span>
                      </div>
                      <p className={`text-[12px] truncate ltr:text-left rtl:text-right block ${isActive ? "text-white/75" : "text-slate-500 dark:text-slate-400"}`}>
                        {item.query_text}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message Reading Pane */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/20 dark:bg-slate-950/20">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                 <ChevronRight className="w-8 h-8 opacity-30 ltr:rotate-0 rtl:rotate-180" />
              </div>
              <p className="text-[14px] font-medium text-slate-500">{t('hist_select')}</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 lg:px-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f172a] shrink-0">
                <div className="flex items-center gap-4 ltr:flex-row rtl:flex-row">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${PLATFORM_META[selected.platform]?.bg || "bg-slate-100 dark:bg-slate-800"}`}>
                    {(() => { const Icon = PLATFORM_META[selected.platform]?.icon || Bot; return <Icon className={`w-5 h-5 ${PLATFORM_META[selected.platform]?.color || "text-slate-400"}`} />; })()}
                  </div>
                  <div className="ltr:text-left rtl:text-right">
                    <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-none mb-1">{selected.bots?.name || "Bot"}</p>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{selected.platform}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(selected.created_at).toLocaleString()}
                </div>
              </div>

              {/* Conversation Bubbles */}
              <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8 flex flex-col">
                {/* User bubble */}
                <div className="flex flex-col ltr:items-end rtl:items-start group">
                  <div className="max-w-[85%] lg:max-w-[70%]">
                    <div className="bg-slate-900 dark:bg-blue-600 text-white text-[13px] leading-relaxed px-5 py-4 rounded-[20px] ltr:rounded-tr-none rtl:rounded-tl-none shadow-md">
                      {selected.query_text}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 px-1 uppercase tracking-widest ltr:text-right rtl:text-left">
                       {t('hist_user_label')}
                    </p>
                  </div>
                </div>

                {/* AI bubble */}
                <div className="flex flex-col ltr:items-start rtl:items-end group">
                  <div className="max-w-[85%] lg:max-w-[70%]">
                    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[13px] leading-relaxed px-5 py-4 rounded-[20px] ltr:rounded-tl-none rtl:rounded-tr-none border border-slate-200 dark:border-slate-800 shadow-sm whitespace-pre-wrap">
                      {selected.ai_response}
                    </div>
                    <div className="flex items-center gap-2 mt-2 px-1 ltr:flex-row rtl:flex-row-reverse">
                      <Bot className="w-3.5 h-3.5 text-blue-500" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {t('hist_ai_label')} · {selected.bots?.name || "Bot"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
