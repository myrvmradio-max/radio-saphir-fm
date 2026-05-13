"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Newspaper, Search } from "lucide-react";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />
      
      <div className="pt-32 pb-12 bg-gray-50/50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-4">
            <Newspaper size={16} />
            <span>Actualités</span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-saphir-navy mb-6">Toute l'information</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-saphir-navy/20" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un article..." 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20 transition-all"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {['Tout', 'Politique', 'Société', 'Culture', 'Sport'].map((cat) => (
                  <button key={cat} className="px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-white border border-gray-100 text-saphir-navy/60 hover:border-saphir-electric hover:text-saphir-electric transition-all">
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      <section className="py-12 container mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[16/10] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 border border-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-saphir-navy/5 font-bold italic">
                  IMAGE
                </div>
              </div>
              <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] font-bold text-saphir-electric uppercase tracking-widest">Catégorie</span>
                 <span className="text-[10px] text-saphir-navy/30 uppercase font-bold tracking-tighter">12 Mai 2026</span>
              </div>
              <h3 className="text-xl font-bold text-saphir-navy group-hover:text-saphir-electric transition-colors leading-snug mb-3">
                Saphir FM s'engage pour l'éducation : retour sur le forum des métiers du média.
              </h3>
              <p className="text-sm text-saphir-navy/40 line-clamp-2 leading-relaxed">
                Découvrez les coulisses de notre dernière intervention auprès des jeunes de la région...
              </p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
