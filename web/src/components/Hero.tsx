"use client";

import { Play, Mic, Radio, Pause } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const STREAM_URL = "https://stream.radiosaphir.com/listen/radiosaphir-106.8-fm/radio.mp3";

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 md:pt-32 pb-20 overflow-hidden">
      {/* Background Gradients (Subtle) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-saphir-electric/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-saphir-navy/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Texte de gauche */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-saphir-navy/5 border border-saphir-navy/10 px-4 py-2 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saphir-electric opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-saphir-electric"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-saphir-navy/60">En direct sur 106.8 FM</span>
            </div>
            
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-saphir-navy">
              Écoutez.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-saphir-navy">
                Informez-vous.
              </span><br />
              Vivez.
            </h1>
            
            <p className="text-base md:text-lg text-saphir-navy/50 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Saphir FM, votre radio de référence. Une programmation moderne, proche de son audience et engagée pour vous accompagner au quotidien.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">

              <Link 
                href="/programmes"
                className="flex items-center justify-center gap-3 bg-white border border-saphir-navy/10 text-saphir-navy px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-gray-50 transition-all"
              >
                Voir la grille
              </Link>
            </div>
          </div>

          {/* Visuel de droite (Premium & Dynamic) */}
          <div className="relative flex justify-center items-center h-[400px] md:h-[600px] mt-10 lg:mt-0">
            {/* Main Image Card - Moins de blanc massif, plus de finesse */}
            <div className="relative z-10 w-full h-full bg-saphir-navy/20 backdrop-blur-sm border-2 md:border-4 border-white/20 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] duration-700 group">
               <img 
                 src="/hero-woman.png" 
                 alt="Saphir FM - L'image du son" 
                 className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
               />
               
               {/* Play Button Overlay */}
               <div className="absolute inset-0 flex items-center justify-center z-20">
                 <div className="relative">
                   {isPlaying && (
                     <>
                       <div className="absolute inset-0 rounded-full bg-saphir-electric animate-ping opacity-75"></div>
                       <div className="absolute inset-0 rounded-full bg-saphir-navy animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
                     </>
                   )}
                   <button 
                     onClick={togglePlay}
                     className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl hover:scale-105 active:scale-95 ${
                       isPlaying 
                       ? "bg-white text-saphir-navy border-2 border-saphir-navy" 
                       : "bg-saphir-navy text-white hover:bg-saphir-electric"
                     }`}
                   >
                     {isPlaying ? <Pause fill="currentColor" size={44} /> : <Play fill="currentColor" size={44} className="ml-1" />}
                   </button>
                 </div>
               </div>
               
               {/* Overlay with Wave - Gradient plus sombre en bas */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#060B1F]/80 via-transparent to-transparent pointer-events-none"></div>
               
               {/* Minimalist Player Info */}
               <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 flex items-end gap-1 h-12 md:h-16">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-saphir-electric/60 backdrop-blur-md rounded-full animate-wave shadow-[0_0_15px_rgba(106,124,255,0.3)]"
                      style={{ 
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: `${0.8 + Math.random()}s`
                      }}
                    />
                  ))}
               </div>
            </div>
            
            {/* Floating Live Badge (Optimisé pour mobile) */}
            <div className="absolute -top-4 -right-4 md:-top-12 md:-right-12 w-28 h-28 md:w-44 md:h-44 bg-saphir-navy/40 backdrop-blur-2xl shadow-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 flex flex-col justify-center gap-1 md:gap-2 animate-bounce duration-[5000ms] z-20 overflow-hidden">
               {/* Accent de couleur discret */}
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-saphir-electric to-transparent"></div>
               
               <div className="w-8 h-8 md:w-10 md:h-10 bg-saphir-electric/20 rounded-xl md:rounded-2xl flex items-center justify-center text-saphir-electric">
                  <Mic size={18} />
               </div>
               <div className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">En Studio</div>
               <div className="text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-tighter">Direct Live 106.8</div>
            </div>

            {/* Decorative Orbitals */}
            <div className="absolute -bottom-10 -left-10 w-40 md:w-56 h-40 md:h-56 bg-saphir-electric/10 rounded-full blur-[60px] md:blur-[100px] -z-10 animate-pulse"></div>
            
            {/* Stats Badge (Hidden on tablets/mobile) */}
            <div className="absolute bottom-20 -left-20 bg-white shadow-2xl border border-gray-100 rounded-3xl p-6 hidden xl:block z-20 animate-float">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                    <Radio size={24} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-saphir-navy">+50k</div>
                    <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Auditeurs Live</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={STREAM_URL} preload="none" />
    </section>
  );
}
