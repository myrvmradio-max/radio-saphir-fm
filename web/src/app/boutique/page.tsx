"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, Search, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function BoutiquePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tous");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from("products").select("*").eq("active", true);
        
        if (category !== "Tous") {
          query = query.eq("category", category);
        }

        const { data, error } = await query.order("created_at", { ascending: false });
        if (data) setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  return (
    <main className="min-h-screen bg-[#FDFDFF]">
      <Navbar />
      
      <div className="pt-32 pb-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-saphir-electric font-black text-[10px] tracking-[0.2em] uppercase mb-4">
            <ShoppingBag size={14} />
            <span>La Boutique Officielle</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-saphir-navy mb-10 tracking-tight leading-tight">
            Merchandising <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saphir-electric to-saphir-navy">Saphir FM 106.8</span>
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-2 rounded-[2rem] border border-gray-100 shadow-xl shadow-saphir-navy/5 gap-4">
             <div className="flex gap-2 overflow-x-auto p-1 no-scrollbar w-full md:w-auto">
                {['Tous', 'Vêtements', 'Accessoires', 'Maison'].map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setCategory(cat)}
                    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      category === cat 
                      ? "bg-saphir-navy text-white shadow-xl shadow-saphir-navy/20 scale-105" 
                      : "text-saphir-navy/30 hover:bg-gray-50 hover:text-saphir-navy"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
             <div className="hidden md:flex items-center gap-4 pr-4">
                <button className="relative w-12 h-12 bg-white border border-gray-100 text-saphir-navy rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm group">
                   <Search size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button className="relative w-12 h-12 bg-saphir-navy text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-saphir-electric transition-all">
                   <ShoppingCart size={20} />
                   <span className="absolute -top-2 -right-2 bg-saphir-electric text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-black">0</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      <section className="py-20 container mx-auto px-6 pb-40">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-[2.5rem] mb-6"></div>
                <div className="h-4 bg-gray-100 w-2/3 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-100 w-1/3 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-14">
            {products.map((product) => (
              <Link href={`/boutique/${product.slug || product.id}`} key={product.id} className="group flex flex-col cursor-pointer">
                <div className="aspect-square bg-white rounded-[2.5rem] mb-6 border border-gray-100 relative overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                  {product.images?.[0] ? (
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="text-saphir-navy/5 font-black uppercase tracking-tighter text-6xl -rotate-12 select-none">
                      {product.category || 'SHOP'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-saphir-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Floating Action Badge */}
                  <div className="absolute bottom-6 left-6 right-6 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                     <div className="bg-white/90 backdrop-blur-md text-saphir-navy py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl">
                        Voir le produit <ArrowRight size={14} />
                     </div>
                  </div>
                </div>
                
                <div className="px-2">
                  <p className="text-[9px] font-black text-saphir-electric uppercase tracking-[0.2em] mb-2">{product.category}</p>
                  <h4 className="text-xl font-black text-saphir-navy mb-2 group-hover:text-saphir-electric transition-colors line-clamp-1">{product.name}</h4>
                  <p className="text-2xl font-playfair font-black text-saphir-navy/40">{product.price} €</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-saphir-navy mb-2">Boutique vide</h3>
            <p className="text-saphir-navy/40 font-medium">Revenez bientôt pour nos nouveaux produits !</p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
