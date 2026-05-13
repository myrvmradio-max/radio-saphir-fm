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

          {/* Visuel de droite (Corrigé) */}
          <div className="relative flex justify-center items-center">
            {/* Le bloc bleu est maintenant mieux dimensionné et ne coupe pas */}
            <div className="relative z-10 w-[90%] aspect-[4/5] bg-saphir-navy border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-700">
               <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Radio size={160} className="text-white" />
               </div>
               {/* Visualiseur simplifié et plus élégant */}
               <div className="absolute bottom-16 left-0 right-0 px-12">
                  <div className="flex items-end gap-1.5 h-24">
                    {[...Array(25)].map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-saphir-electric rounded-full animate-wave"
                        style={{ 
                          height: `${30 + Math.random() * 70}%`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${0.8 + Math.random()}s`
                        }}
                      />
                    ))}
                  </div>
               </div>
            </div>
            
            {/* L'icône micro est maintenant bien visible et mise en valeur */}
            <div className="absolute -top-10 -right-5 w-28 h-28 bg-white shadow-2xl border border-gray-100 rounded-3xl flex items-center justify-center animate-bounce duration-[4000ms] z-20">
               <Mic className="text-saphir-electric" size={40} />
            </div>

            {/* Décoration supplémentaire pour aérer */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-saphir-electric rounded-full blur-[80px] opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
