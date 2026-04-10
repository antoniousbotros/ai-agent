"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { UserPlus, Mail, Lock, Loader2, Github, User } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Supabase Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Ensuring the public.users record exists
    // (In a production app, we would use a DB trigger, but for this SaaS we ensure it here)
    if (authData.user) {
        const { error: profileError } = await supabase
            .from('users')
            .upsert({ 
                id: authData.user.id, 
                email: email,
                full_name: fullName,
                role: 'user',
                status: 'active'
            });
            
        if (profileError) {
            console.error("Profile sync error:", profileError);
        }
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthLayout>
      <div className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-slate-900 dark:text-white">Start building</h1>
          <p className="text-[14px] text-slate-500 mt-2">Join 1,000+ developers creating AI agents</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
            <div className="relative group">
              <User className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 py-3 text-[14px] outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>

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
            <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
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
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Free Account <UserPlus className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-[14px] text-slate-500 text-center mt-8">
          Already have an account? <Link href="/login" className="text-blue-500 hover:text-blue-600 font-bold">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
