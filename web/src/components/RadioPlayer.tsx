"use client";

import { Play, Pause, Volume2, Radio as RadioIcon, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgram, setCurrentProgram] = useState({
    name: "Le Grand Matin Saphir",
    host: "Jean-Michel",
    time: "07:00 - 10:00",
    isLoading: true
  });

  useEffect(() => {
    async function fetchCurrentProgram() {
      try {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        const currentDay = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][now.getDay()];

        const { data, error } = await supabase
          .from('programmes')
          .select('*')
          .eq('day', currentDay)
          .lte('start_time', currentTime)
          .gte('end_time', currentTime)
          .single();

        if (data) {
          setCurrentProgram({
            name: data.name,
            host: data.host,
            time: `${data.start_time.substring(0, 5)} - ${data.end_time.substring(0, 5)}`,
            isLoading: false
          });
        } else {
          // Fallback if no specific program is found (e.g., night time)
          setCurrentProgram(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error("Error fetching program:", err);
        setCurrentProgram(prev => ({ ...prev, isLoading: false }));
      }
    }

    fetchCurrentProgram();
    const interval = setInterval(fetchCurrentProgram, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-2xl shadow-saphir-navy/10 relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-saphir-electric/20 rounded-full blur-[80px] group-hover:bg-saphir-electric/30 transition-all duration-700"></div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Album Art / Logo */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-saphir-electric/20 to-saphir-navy/20 rounded-3xl blur-md"></div>
          <div className="relative w-full h-full bg-white rounded-3xl flex items-center justify-center overflow-hidden shadow-inner border border-gray-100">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100 opacity-50"></div>
             {isPlaying ? (
               <div className="flex items-center gap-1">
                 {[...Array(4)].map((_, i) => (
                   <div 
                    key={i} 
                    className="w-1.5 bg-saphir-electric rounded-full animate-wave"
                    style={{ height: '32px', animationDelay: `${i * 0.15}s` }}
                   ></div>
                 ))}
               </div>
             ) : (
               <RadioIcon size={48} className="text-saphir-navy/10" />
             )}
          </div>
        </div>

        {/* Info & Controls */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">En Direct</span>
            </div>
            {currentProgram.isLoading && (
              <div className="h-4 w-20 bg-gray-100 animate-pulse rounded-full"></div>
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-saphir-navy mb-1 tracking-tight">
            {currentProgram.name}
          </h3>
          <div className="flex items-center justify-center md:justify-start gap-2 text-saphir-electric text-sm font-bold mb-6">
            <span className="opacity-60">PAR</span> {currentProgram.host.toUpperCase()}
            <span className="w-1.5 h-1.5 rounded-full bg-saphir-navy/10"></span>
            <div className="flex items-center gap-1 text-saphir-navy/40">
              <Clock size={14} />
              {currentProgram.time}
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-6">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                isPlaying 
                ? "bg-white text-saphir-navy border-2 border-saphir-navy" 
                : "bg-saphir-navy text-white hover:bg-saphir-electric"
              }`}
            >
              {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-4 flex-1 max-w-xs">
              <Volume2 size={20} className="text-saphir-navy/30" />
              <div className="h-2 bg-gray-100 flex-1 rounded-full overflow-hidden border border-gray-200/50 shadow-inner">
                <div className="h-full bg-gradient-to-r from-saphir-electric to-[#8B99FF] w-2/3 shadow-[0_0_10px_rgba(106,124,255,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
