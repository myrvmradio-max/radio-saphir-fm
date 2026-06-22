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
      </div>      <section className="py-16 container mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
             [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-100 rounded-[2rem] mb-6"></div>
                <div className="h-6 bg-gray-100 w-full mb-2 rounded"></div>
                <div className="h-4 bg-gray-100 w-1/3 rounded"></div>
              </div>
            ))
          ) : videos.length === 0 ? (
            <div className="col-span-full py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest bg-gray-50/50 rounded-3xl border border-dashed border-gray-100">
              Aucune vidéo disponible
            </div>
          ) : (
            videos.map((video) => (
              <Link href={video.video_url} target="_blank" key={video.id} className="group cursor-pointer">
                <div className="aspect-video bg-white rounded-[2rem] mb-6 border border-gray-100 relative overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                   {video.thumbnail ? (
                     <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                       <Play size={24} className="text-saphir-navy/20 group-hover:text-saphir-electric transition-colors" />
                     </div>
                   )}
                   {/* Play Button Icon on Hover */}
                   <div className="absolute inset-0 bg-saphir-navy/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="w-14 h-14 bg-white text-saphir-navy rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                       <Play fill="currentColor" size={20} className="ml-1" />
                     </div>
                   </div>
                </div>
                <h4 className="font-bold text-lg leading-snug group-hover:text-saphir-electric transition-colors line-clamp-2 px-1">
                  {video.title}
                </h4>
                <p className="mt-3 text-[10px] text-saphir-navy/30 uppercase font-bold tracking-widest italic px-1">{video.category || 'Replay'} • {new Date(video.created_at).toLocaleDateString()}</p>
              </Link>
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
