"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // Redirect to admin if already logged in
  useEffect(() => {
    async function checkActiveSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/admin");
      } else {
        setCheckingSession(false);
      }
    }
    checkActiveSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.replace("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Identifiants incorrects. Veuillez réessayer.");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#060B1F] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="animate-spin text-saphir-electric" size={40} />
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Chargement...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#060B1F] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glowing effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-saphir-electric/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#8B99FF]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Brand/Logo Header */}
        <div className="text-center space-y-4">
          <div className="relative w-44 h-16 bg-white rounded-2xl p-2.5 mx-auto shadow-2xl border border-white/10">
            <Image 
              src="/logo.png" 
              alt="Saphir FM Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">Espace Administration</h1>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Saphir FM 106.8</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-saphir-electric via-[#8B99FF] to-transparent rounded-t-[2.5rem]"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-saphir-electric/20 rounded-xl flex items-center justify-center text-saphir-electric">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Connexion Sécurisée</h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Accès restreint au personnel</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Adresse E-mail</label>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-saphir-electric focus-within:ring-1 focus-within:ring-saphir-electric transition-all">
                <Mail className="absolute left-4 text-white/30" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@saphirfm.com" 
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-sm text-white focus:outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Mot de Passe</label>
              </div>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-saphir-electric focus-within:ring-1 focus-within:ring-saphir-electric transition-all">
                <Lock className="absolute left-4 text-white/30" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••" 
                  className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-sm text-white focus:outline-none placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium leading-relaxed">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-saphir-electric to-[#8B99FF] text-white py-4 px-6 rounded-2xl font-black text-xs tracking-widest transition-all shadow-[0_15px_40px_rgba(106,124,255,0.3)] hover:shadow-[0_20px_50px_rgba(106,124,255,0.5)] flex items-center justify-center gap-3 active:scale-[0.98] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authentification...
                </>
              ) : (
                <>
                  Se Connecter
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
          © 2026 Saphir FM 106.8 • Tous Droits Réservés
        </p>
      </div>
    </main>
  );
}
