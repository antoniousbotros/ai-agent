"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { GlassButton } from "@/components/dashboard/ui-components";
import { LogIn, Mail, Lock, Loader2, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-[14px] text-slate-500 mt-2">Enter your credentials to access your agents</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <Mail className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 py-3 text-[14px] outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
              <Link href="#" className="text-[12px] text-blue-500 hover:text-blue-600 font-medium">Forgot?</Link>
            </div>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 py-3 text-[14px] outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[12px] font-medium animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-[48px] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login to Rabeh <LogIn className="w-4 h-4 ltr:rotate-0 rtl:rotate-180" /></>}
          </button>
        </form>

        <div className="relative my-8">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-white/10"></div></div>
           <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-widest text-slate-400"><span className="bg-white dark:bg-[#121212] px-3">or continue with</span></div>
        </div>

        <button className="w-full bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 h-[48px] rounded-xl font-semibold text-slate-700 dark:text-white flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
           <Github className="w-5 h-5" />
           GitHub
        </button>

        <p className="text-[14px] text-slate-500 text-center mt-8">
          New to the platform? <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-bold">Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
