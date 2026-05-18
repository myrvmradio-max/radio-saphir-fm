"use client";

import { Play, Mic, Radio, Pause, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [currentProgram, setCurrentProgram] = useState({
    name: "Chargement...",
    host: "...",
    time: "--:--",
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
          setCurrentProgram({
            name: "Saphir FM - En Direct",
            host: "Direct",
            time: "24/7",
            isLoading: false
          });
        }
      } catch (err) {
        console.error("Error fetching program:", err);
        setCurrentProgram(prev => ({ ...prev, isLoading: false }));
      }
    }

    fetchCurrentProgram();
    const interval = setInterval(fetchCurrentProgram, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const STREAM_URL = "https://stream.radiosaphir.com/listen/radiosaphir-106.8-fm/radio.mp3";

  // Synchronisation si le stream se coupe ou est mis en pause par le système
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    try {
      if (isPlaying) {
        // STOP COMPLET
        audio.pause();
        audio.currentTime = 0; // Remet le temps à zéro
        audio.removeAttribute("src"); // Déconnecte le flux
        audio.load(); // Recharge l'élément pour couper la connexion
        setIsPlaying(false);
      } else {
        // Recharge le stream proprement
        audio.src = STREAM_URL;
        audio.crossOrigin = "anonymous"; // Pour iOS/Safari
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 md:pt-32 pb-20 overflow-hidden">
      {/* Background Gradients (Subtle) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-saphir-electric/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-saphir-navy/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Texte de gauche */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-saphir-navy">
              Écoutez<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-saphir-navy">
                Informez-vous
              </span><br />
              Vivez saphir FM !
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
          <div className="relative flex justify-center items-center h-[400px] md:h-[600px] mt-10 lg:mt-0 order-1 lg:order-2">
            {/* Main Image Card - Moins de blanc massif, plus de finesse */}
            <div className="relative z-10 w-full h-full bg-saphir-navy/20 backdrop-blur-sm border-2 md:border-4 border-white/20 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] duration-700 group">
               <img 
                 src="/hero-woman.png" 
                 alt="Saphir FM - L'image du son" 
                 className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
               />
               
               {/* Play Button and Text Overlay */}
               <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 z-20">
                 <div className="relative mb-4">
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
                 
                 {/* Text Info (White on dark overlay) */}
                 <div className="text-white text-center">
                   <h3 className="text-xl md:text-2xl font-bold mb-1 tracking-tight">{currentProgram.name}</h3>
                    <div className="flex items-center justify-center gap-2 text-white/80 text-xs font-bold">
                      {currentProgram.host === "Direct" ? (
                        <>
                          <span>BOUAKÉ</span>
                          <span className="w-1 h-1 rounded-full bg-white/40"></span>
                          <span>106.8 FM</span>
                        </>
                      ) : (
                        <>
                          <span>PAR {currentProgram.host.toUpperCase()}</span>
                          <span className="w-1 h-1 rounded-full bg-white/40"></span>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {currentProgram.time}
                          </div>
                        </>
                      )}
                    </div>
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
      <audio ref={audioRef} preload="none" />
    </section>
  );
}
