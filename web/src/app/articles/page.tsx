"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Newspaper, Search, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });
        
        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

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
          {loading ? (
             [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-gray-100 rounded-[2.5rem] mb-6"></div>
                <div className="h-4 bg-gray-100 w-1/4 mb-3 rounded"></div>
                <div className="h-6 bg-gray-100 w-full mb-2 rounded"></div>
                <div className="h-6 bg-gray-100 w-2/3 rounded"></div>
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-3 py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
              Aucun article publié pour le moment
            </div>
          ) : (
            articles.map((article) => (
              <Link href={`/articles/${article.slug}`} key={article.id} className="group cursor-pointer">
                <div className="aspect-[16/10] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 border border-gray-100 relative">
                  {article.cover_image ? (
                    <img src={article.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-saphir-navy/5 font-bold italic">
                      SAPHIR FM
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] font-bold text-saphir-electric uppercase tracking-widest">{article.category}</span>
                   <span className="text-[10px] text-saphir-navy/30 uppercase font-bold tracking-tighter">
                    {new Date(article.published_at || article.created_at).toLocaleDateString()}
                   </span>
                </div>
                <h3 className="text-xl font-bold text-saphir-navy group-hover:text-saphir-electric transition-colors leading-snug mb-3">
                  {article.title}
                </h3>
                <div className="text-sm text-saphir-navy/40 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }}>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
