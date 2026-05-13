"use client";

import { Play, Mic, Radio } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Gradients (Subtle) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-saphir-electric/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-saphir-navy/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Texte de gauche */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-saphir-navy/5 border border-saphir-navy/10 px-4 py-2 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saphir-electric opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-saphir-electric"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-saphir-navy/60">En direct sur 106.8 FM</span>
            </div>
            
            <h1 className="font-playfair text-6xl md:text-8xl font-bold leading-[1.1] text-saphir-navy">
              Écoutez.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-saphir-navy">
                Informez-vous.
              </span><br />
              Vivez.
            </h1>
            
            <p className="text-lg text-saphir-navy/50 max-w-lg leading-relaxed font-medium">
              Saphir FM, votre radio de référence. Une programmation moderne, proche de son audience et engagée pour vous accompagner au quotidien.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-3 bg-saphir-navy text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-saphir-electric transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-saphir-navy/20">
                <Play fill="currentColor" size={20} />
                Lancer le direct
              </button>
              <button className="flex items-center gap-3 bg-white border border-saphir-navy/10 text-saphir-navy px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                Voir la grille
              </button>
            </div>
          </div>

          {/* Visuel de droite (Premium & Dynamic) */}
          <div className="relative flex justify-center items-center h-[500px] md:h-[600px]">
            {/* Main Image Card */}
            <div className="relative z-10 w-full h-full bg-white border-8 border-white rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] duration-700">
               <img 
                 src="/hero-woman.png" 
                 alt="Saphir FM - L'image du son" 
                 className="w-full h-full object-cover"
               />
               
               {/* Overlay with Wave */}
               <div className="absolute inset-0 bg-gradient-to-t from-saphir-navy/40 to-transparent"></div>
               
               {/* Minimalist Player Info */}
               <div className="absolute bottom-10 left-10 right-10 flex items-end gap-1.5 h-16">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-white/40 backdrop-blur-md rounded-full animate-wave"
                      style={{ 
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: `${0.8 + Math.random()}s`
                      }}
                    />
                  ))}
               </div>
            </div>
            
            {/* Floating Live Badge */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20 rounded-[3rem] p-6 flex flex-col justify-center gap-2 animate-bounce duration-[5000ms] z-20">
               <div className="w-10 h-10 bg-saphir-electric/10 rounded-2xl flex items-center justify-center text-saphir-electric">
                  <Mic size={20} />
               </div>
               <div className="text-xs font-black text-saphir-navy uppercase tracking-widest">En Studio</div>
               <div className="text-[10px] font-bold text-saphir-navy/40">Direct Live 106.8</div>
            </div>

            {/* Decorative Orbitals */}
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-saphir-electric/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="absolute top-20 -right-20 w-40 h-40 bg-saphir-navy/5 rounded-full blur-[80px] -z-10"></div>
            
            {/* Stats Badge */}
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
    </section>
  );
}
