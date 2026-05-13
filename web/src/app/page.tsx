"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RadioPlayer from "@/components/RadioPlayer";
import SupabaseTest from "@/components/SupabaseTest";
import Footer from "@/components/Footer";
import { Newspaper, Headphones, ShoppingBag, Youtube, ArrowRight, Play } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <Hero />
      <SupabaseTest />

      {/* SECTION 1: RADIO LIVE */}
      <section className="container mx-auto px-6 -mt-20 relative z-30">
        <RadioPlayer />
      </section>

      {/* SECTION 2: ACTUALITÉS */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-2">
              <Newspaper size={16} />
              <span>Dernières Actualités</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-saphir-navy">À la une aujourd'hui</h2>
          </div>
          <button className="flex items-center gap-2 text-saphir-navy/40 hover:text-saphir-electric transition-colors group font-bold text-sm">
            Voir tout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[16/10] bg-gray-50 rounded-3xl overflow-hidden mb-6 border border-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-saphir-navy/5 font-bold italic text-2xl">
                  ACTU {i}
                </div>
              </div>
              <div className="flex gap-4 text-[10px] font-bold text-saphir-electric uppercase tracking-widest mb-3">
                <span>Politique</span>
                <span className="text-gray-200">•</span>
                <span className="text-saphir-navy/40 italic">Il y a 2h</span>
              </div>
              <h3 className="text-xl font-bold text-saphir-navy group-hover:text-saphir-electric transition-colors leading-snug">
                Le nouveau plan de développement urbain pour la ville de Saphir : ce qu'il faut savoir.
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PODCASTS */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-2">
                <Headphones size={16} />
                <span>Podcasts</span>
              </div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-saphir-navy">Vos séries préférées</h2>
            </div>
            <button className="flex items-center gap-2 text-saphir-navy/40 hover:text-saphir-electric transition-colors group font-bold text-sm">
              Explorer les séries <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Histoire', 'Culture', 'Débat', 'Musique'].map((title, i) => (
              <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2rem] hover:border-saphir-electric/50 hover:shadow-xl transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-saphir-electric transition-colors">
                  <Headphones className="text-saphir-electric group-hover:text-white" />
                </div>
                <h4 className="text-lg font-bold text-saphir-navy mb-2">Série {title}</h4>
                <p className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">12 épisodes</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: E-COMMERCE */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-2">
              <ShoppingBag size={16} />
              <span>Boutique Officielle</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-saphir-navy">Portez vos couleurs</h2>
          </div>
          <button className="flex items-center gap-2 text-saphir-navy/40 hover:text-saphir-electric transition-colors group font-bold text-sm">
            Visiter la boutique <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'T-shirt Saphir Classic', price: '25.00 €' },
            { name: 'Casquette Logo 106.8', price: '18.50 €' },
            { name: 'Mug Saphir FM', price: '12.00 €' },
            { name: 'Sweat à capuche Navy', price: '45.00 €' },
          ].map((product, i) => (
            <div key={i} className="group">
              <div className="aspect-square bg-gray-50 rounded-3xl mb-6 border border-gray-100 relative overflow-hidden flex items-center justify-center">
                <div className="text-saphir-navy/5 font-bold uppercase tracking-tighter text-4xl -rotate-12">
                  SHOP
                </div>
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-saphir-navy text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                  <ShoppingBag size={20} />
                </button>
              </div>
              <h4 className="font-bold text-saphir-navy mb-1">{product.name}</h4>
              <p className="text-saphir-electric font-bold">{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: VIDÉOS */}
      <section className="py-24 bg-saphir-navy/5">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-2">
                <Youtube size={16} />
                <span>Vidéos & Replays</span>
              </div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-saphir-navy">L'image du son</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-video bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-t from-saphir-navy/40 to-transparent"></div>
               <div className="w-20 h-20 bg-saphir-navy rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-saphir-electric transition-all z-10">
                 <Play fill="white" className="text-white ml-1" />
               </div>
               <div className="absolute bottom-10 left-10 z-10">
                 <h4 className="text-2xl font-bold text-white mb-1 leading-tight">Dernier Live Studio</h4>
                 <p className="text-white/60 text-xs font-bold uppercase tracking-widest">24 mars 2026</p>
               </div>
            </div>
            <div className="grid grid-rows-2 gap-8">
               {[1, 2].map((i) => (
                 <div key={i} className="flex gap-6 group cursor-pointer bg-white p-4 rounded-3xl border border-gray-100 hover:shadow-lg transition-all">
                    <div className="w-40 aspect-video bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                       <Play size={20} className="text-saphir-navy/20 group-hover:text-saphir-electric transition-colors" />
                    </div>
                    <div className="flex flex-col justify-center">
                       <h5 className="font-bold text-saphir-navy mb-2 group-hover:text-saphir-electric transition-colors leading-snug">Interview exclusive : Saphir FM reçoit l'artiste du moment.</h5>
                       <p className="text-[10px] text-saphir-navy/40 uppercase font-bold tracking-widest">Musique</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
