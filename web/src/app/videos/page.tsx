"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Youtube, Play, Calendar, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-saphir-navy">
      <Navbar />
      
      <div className="pt-32 pb-12 bg-gray-50/50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-saphir-electric font-bold text-sm tracking-widest uppercase mb-4">
            <Youtube size={16} />
            <span>Vidéos & Replays</span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-saphir-navy mb-6">Saphir TV</h1>
          <p className="text-saphir-navy/40 max-w-2xl text-lg">Vivez l'expérience Saphir FM en images : interviews exclusives, coulisses et lives studio.</p>
        </div>
      </div>

      <section className="py-12 container mx-auto px-6">
        {loading ? (
          <div className="aspect-video bg-gray-50 rounded-[3rem] animate-pulse"></div>
        ) : videos.length === 0 ? (
          <div className="py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
            Aucune vidéo disponible
          </div>
        ) : (
          <Link href={videos[0].url} target="_blank" className="block relative aspect-video bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 group cursor-pointer shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-t from-saphir-navy/60 via-transparent to-transparent opacity-80 z-10"></div>
             {videos[0].thumbnail && (
               <img src={videos[0].thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
             )}
             <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-24 h-24 bg-white text-saphir-navy rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-saphir-electric group-hover:text-white transition-all">
                  <Play fill="currentColor" size={32} className="ml-2" />
                </div>
             </div>
             <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-30">
                <div>
                  <span className="bg-saphir-electric text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">Dernier Replay</span>
                  <h2 className="text-4xl font-bold mb-2 text-white line-clamp-1">{videos[0].title}</h2>
                  <div className="flex items-center gap-4 text-white/60 text-sm font-medium">
                     <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(videos[0].created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]">
                  Regarder <ExternalLink size={16} />
                </div>
             </div>
          </Link>
        )}
      </section>

      <section className="py-24 container mx-auto px-6 pb-32">
        <h3 className="text-2xl font-bold mb-12">Plus de vidéos</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
             [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-100 rounded-[2rem] mb-6"></div>
                <div className="h-6 bg-gray-100 w-full mb-2 rounded"></div>
                <div className="h-4 bg-gray-100 w-1/3 rounded"></div>
              </div>
            ))
          ) : (
            videos.slice(1).map((video) => (
              <Link href={video.url} target="_blank" key={video.id} className="group cursor-pointer">
                <div className="aspect-video bg-gray-50 rounded-[2rem] mb-6 border border-gray-100 relative overflow-hidden flex items-center justify-center">
                   {video.thumbnail ? (
                     <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <Play size={24} className="text-saphir-navy/10 group-hover:opacity-100 group-hover:text-saphir-electric transition-all" />
                   )}
                </div>
                <h4 className="font-bold text-lg leading-snug group-hover:text-saphir-electric transition-colors line-clamp-2">
                  {video.title}
                </h4>
                <p className="mt-3 text-[10px] text-saphir-navy/30 uppercase font-bold tracking-widest italic">{video.category || 'Replay'} • {new Date(video.created_at).toLocaleDateString()}</p>
              </Link>
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
