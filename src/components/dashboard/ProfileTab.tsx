"use client";

import { useTranslations } from "next-intl";
import { User, Mail, Building2, Save, Loader2, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "@/app/actions";

export default function ProfileTab() {
  const t = useTranslations('Dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    async function load() {
      const profile = await getUserProfile();
      if (profile) {
        setEmail(profile.email || "");
        setFullName(profile.full_name || "");
        setCompany(profile.company_name || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateUserProfile(fullName, company);
    if (!result.success) {
      alert(`Save failed. You may need to run this SQL in Supabase:\n\nALTER TABLE users ADD COLUMN full_name TEXT;\nALTER TABLE users ADD COLUMN company_name TEXT;`);
    } else {
       alert("Profile saved successfully.");
    }
    setSaving(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white ltr:text-left rtl:text-right">{t('profile_title')}</h2>
          <p className="text-[14px] text-slate-500 mt-1 ltr:text-left rtl:text-right">{t('profile_subtitle')}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-[14px] text-slate-500 animate-pulse">Loading...</p>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
           
           {/* Avatar Section */}
           <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-6 ltr:flex-row rtl:flex-row">
               <div className="relative group cursor-pointer">
                   <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-sm flex items-center justify-center overflow-hidden">
                       <span className="text-[32px] font-medium text-slate-400">
                          {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                       </span>
                   </div>
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera className="w-6 h-6 text-white" />
                   </div>
               </div>
               <div className="ltr:text-left rtl:text-right">
                   <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">{t('profile_th_img')}</h3>
                   <p className="text-[13px] text-slate-500 mt-1">{t('profile_th_img_desc')}</p>
               </div>
           </div>

           <div className="p-8 space-y-6">
              
              {/* Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                     <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 ltr:text-left rtl:text-right">
                        <User className="w-4 h-4 text-slate-400" /> {t('profile_field_name')}
                     </label>
                     <input 
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#fafafa] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[14px] rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-medium"
                     />
                 </div>

                 {/* Company Name */}
                 <div className="space-y-2">
                     <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 ltr:text-left rtl:text-right">
                        <Building2 className="w-4 h-4 text-slate-400" /> {t('profile_field_company')}
                     </label>
                     <input 
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full bg-[#fafafa] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[14px] rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-medium"
                     />
                 </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 ltr:text-left rtl:text-right">
                     <Mail className="w-4 h-4 text-slate-400" /> {t('profile_field_email')}
                  </label>
                  <input 
                     type="email"
                     value={email}
                     disabled
                     className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 text-[14px] rounded-xl px-4 py-3 outline-none opacity-80 cursor-not-allowed font-medium"
                  />
                  <p className="text-[12px] text-slate-400 mt-1 ltr:text-left rtl:text-right">{t('profile_field_email_desc')}</p>
              </div>
           </div>

           <div className="p-6 bg-[#fafafa] dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                  {t('profile_save_btn')}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
