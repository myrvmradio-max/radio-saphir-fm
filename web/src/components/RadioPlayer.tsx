"use client";

import { Play, Pause, Volume2, Radio as RadioIcon } from "lucide-react";
import { useState } from "react";

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl shadow-saphir-navy/5">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Album Art / Logo */}
        <div className="relative w-32 h-32 flex-shrink-0 group">
          <div className="absolute inset-0 bg-saphir-electric/10 rounded-2xl blur-lg group-hover:bg-saphir-electric/20 transition-all"></div>
          <div className="relative w-full h-full bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
             <RadioIcon size={48} className="text-saphir-navy/20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <RadioIcon size={48} className="text-saphir-electric animate-pulse" />
             </div>
          </div>
        </div>

        {/* Info & Controls */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest text-saphir-navy/40 uppercase">En Direct</span>
          </div>
          <h3 className="text-2xl font-bold text-saphir-navy mb-1">Le Grand Matin Saphir</h3>
          <p className="text-saphir-electric text-sm font-bold mb-4 uppercase tracking-tight">Animé par Jean-Michel • 07:00 - 10:00</p>
          
          <div className="flex items-center justify-center md:justify-start gap-6">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-saphir-navy flex items-center justify-center hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/20"
            >
              {isPlaying ? <Pause fill="white" className="text-white" /> : <Play fill="white" className="text-white" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xs">
              <Volume2 size={18} className="text-saphir-navy/20" />
              <div className="h-1 bg-gray-100 flex-1 rounded-full overflow-hidden">
                <div className="h-full bg-saphir-electric w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer effect */}
        <div className="hidden lg:flex items-end gap-1 h-12">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 bg-saphir-electric/20 rounded-full ${isPlaying ? 'animate-bounce' : ''}`}
              style={{ height: `${20 + Math.random() * 80}%`, animationDuration: `${0.5 + Math.random()}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
