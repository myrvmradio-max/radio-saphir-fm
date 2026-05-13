"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, Search, ShoppingCart } from "lucide-react";

const PRODUCTS = [
  { name: 'T-shirt Saphir Classic', price: '25.00 €', category: 'Vêtements' },
  { name: 'Casquette Logo 106.8', price: '18.50 €', category: 'Accessoires' },
  { name: 'Mug Saphir FM', price: '12.00 €', category: 'Maison' },
  { name: 'Sweat à capuche Navy', price: '45.00 €', category: 'Vêtements' },
  { name: 'Stickers Pack', price: '5.00 €', category: 'Accessoires' },
  { name: 'Gourde Métal', price: '22.00 €', category: 'Maison' },
];

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />
      
      <div className="pt-32 pb-12 bg-gray-50/50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-4">
            <ShoppingBag size={16} />
            <span>La Boutique</span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-saphir-navy mb-6">Merchandising Officiel</h1>
          
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
                {['Tous', 'Vêtements', 'Accessoires', 'Maison'].map((cat) => (
                  <button key={cat} className="px-6 py-2 rounded-xl text-xs font-bold bg-gray-50 border border-gray-100 text-saphir-navy/60 hover:bg-saphir-navy hover:text-white transition-all">
                    {cat}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-4">
                <button className="relative w-12 h-12 bg-saphir-navy text-white rounded-2xl flex items-center justify-center shadow-lg">
                   <ShoppingCart size={20} />
                   <span className="absolute -top-2 -right-2 bg-saphir-electric text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">0</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      <section className="py-12 container mx-auto px-6 pb-32">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {PRODUCTS.map((product, i) => (
            <div key={i} className="group flex flex-col">
              <div className="aspect-square bg-gray-50 rounded-[2.5rem] mb-6 border border-gray-100 relative overflow-hidden flex items-center justify-center">
                <div className="text-saphir-navy/5 font-bold uppercase tracking-tighter text-5xl -rotate-12 select-none">
                  {product.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-saphir-navy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button className="absolute bottom-6 left-6 right-6 bg-saphir-navy text-white py-4 rounded-2xl font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-saphir-electric shadow-xl">
                  Ajouter au panier
                </button>
              </div>
              <p className="text-[10px] font-bold text-saphir-electric uppercase tracking-widest mb-1">{product.category}</p>
              <h4 className="text-lg font-bold text-saphir-navy mb-2">{product.name}</h4>
              <p className="text-xl font-playfair font-bold text-saphir-navy/60">{product.price}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
