"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Headphones, Play, ListMusic, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PodcastsPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          { data: seriesData },
          { data: episodeData }
        ] = await Promise.all([
          supabase.from("series").select("*").order("created_at", { ascending: false }),
          supabase.from("podcasts").select("*, series(title)").order("created_at", { ascending: false }).limit(10)
        ]);

        setSeries(seriesData || []);
        setEpisodes(episodeData || []);
      } catch (error) {
        console.error("Error fetching podcasts data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />
      
      <div className="pt-32 pb-12 bg-gray-50/50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-4">
            <Headphones size={16} />
            <span>Médiathèque</span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-saphir-navy mb-6">Podcasts & Séries</h1>
          <p className="text-saphir-navy/40 max-w-2xl text-lg">Retrouvez toutes nos émissions en replay, des enquêtes exclusives et nos playlists thématiques.</p>
        </div>
      </div>

      <section className="py-12 container mx-auto px-6">
        <h2 className="text-2xl font-bold text-saphir-navy mb-8 flex items-center gap-3">
          <ListMusic className="text-saphir-electric" /> Séries Populaires
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [1, 2].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row bg-white border border-gray-100 rounded-[2.5rem] animate-pulse h-48"></div>
            ))
          ) : series.length === 0 ? (
            <div className="col-span-2 py-10 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
              Aucune série disponible
            </div>
          ) : (
            series.map((s) => (
              <Link href={`/podcasts/${s.id}`} key={s.id} className="flex flex-col sm:flex-row bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:border-saphir-electric/50 hover:shadow-xl transition-all group cursor-pointer">
                <div className="w-full sm:w-48 aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {s.cover_image ? (
                    <img src={s.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="text-saphir-navy/5 font-bold uppercase tracking-widest text-2xl">SÉRIE</div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col justify-center">
                   <h3 className="text-2xl font-bold text-saphir-navy mb-2 group-hover:text-saphir-electric transition-colors line-clamp-1">{s.title}</h3>
                   <p className="text-sm text-saphir-navy/40 mb-6 line-clamp-2">{s.description}</p>
                   <div className="flex items-center gap-4 text-[10px] font-bold text-saphir-navy/60 uppercase tracking-widest">
                     <span className="bg-gray-100 px-2 py-1 rounded">Série</span>
                   </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="py-12 container mx-auto px-6 pb-32">
        <h2 className="text-2xl font-bold text-saphir-navy mb-8 flex items-center gap-3">
          <Clock className="text-saphir-electric" /> Derniers Épisodes
        </h2>
        
        <div className="space-y-4">
          {loading ? (
             [1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
            ))
          ) : episodes.length === 0 ? (
            <div className="py-10 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
              Aucun épisode disponible
            </div>
          ) : (
            episodes.map((episode) => (
              <Link href={episode.audio_url || '#'} key={episode.id} target="_blank" className="flex items-center gap-6 p-5 bg-white hover:bg-gray-50 rounded-3xl border border-gray-100 transition-all group cursor-pointer">
                 <div className="w-12 h-12 rounded-full bg-saphir-navy flex items-center justify-center text-white shadow-lg group-hover:bg-saphir-electric transition-all flex-shrink-0">
                   <Play size={20} fill="white" />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-saphir-navy mb-1 group-hover:text-saphir-electric transition-colors line-clamp-1">{episode.title}</h4>
                   <p className="text-xs text-saphir-navy/40 font-bold uppercase tracking-widest">
                    {episode.series?.title || 'Podcasts'} • {new Date(episode.created_at).toLocaleDateString()}
                   </p>
                 </div>
                 <button className="text-saphir-navy/10 hover:text-saphir-electric transition-colors">
                   <Headphones size={20} />
                 </button>
              </Link>
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
