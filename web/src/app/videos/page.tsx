"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Youtube, Play, Loader2, X } from "lucide-react";

/**
 * Extrait l'identifiant d'une vidéo YouTube depuis une URL quelconque.
 * Supporte les formats : watch?v=, youtu.be/, shorts/, live/, embed/
 */
function getYoutubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  if (cleanUrl.includes("youtube.com/embed/")) {
    const match = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : cleanUrl;
  }

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = cleanUrl.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  try {
    const withProtocol = cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") ? cleanUrl : `https://${cleanUrl}`;
    const parsed = new URL(withProtocol);
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1).split("?")[0].split("/")[0];
      if (id && id.length === 11) return `https://www.youtube.com/embed/${id}`;
    }
    const v = parsed.searchParams.get("v");
    if (v && v.length === 11) return `https://www.youtube.com/embed/${v}`;
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2 && (pathParts[0] === "live" || pathParts[0] === "shorts")) {
      const id = pathParts[1];
      if (id && id.length === 11) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }

  return null;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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
            <span>Vidéos &amp; Replays</span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-saphir-navy mb-6">Saphir TV</h1>
          <p className="text-saphir-navy/40 max-w-2xl text-lg">Vivez l'expérience Saphir FM en images : interviews exclusives, coulisses et lives studio.</p>
        </div>
      </div>

      <section className="py-16 container mx-auto px-6 pb-32">
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
            videos.map((video) => {
              const embedUrl = getYoutubeEmbedUrl(video.video_url);
              const isActive = activeVideo === video.id;

              return (
                <div key={video.id} className="group cursor-pointer">
                  {/* Zone vidéo */}
                  <div className="aspect-video bg-white rounded-[2rem] mb-6 border border-gray-100 relative overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    {isActive && embedUrl ? (
                      /* Lecture directe de la vidéo dans la page */
                      <div className="w-full h-full relative">
                        <iframe
                          src={`${embedUrl}?autoplay=1&rel=0`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-[2rem]"
                        />
                        <button
                          onClick={() => setActiveVideo(null)}
                          className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-black text-white p-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1 text-[11px] px-2.5 shadow-lg"
                          title="Fermer la vidéo"
                        >
                          <X size={12} />
                          <span>Fermer</span>
                        </button>
                      </div>
                    ) : (
                      /* Miniature cliquable avec bouton play */
                      <button
                        onClick={() => setActiveVideo(video.id)}
                        className="w-full h-full relative"
                        aria-label={`Lire ${video.title}`}
                      >
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : embedUrl ? (
                          /* Miniature automatique YouTube si pas de thumbnail */
                          <img
                            src={`https://img.youtube.com/vi/${embedUrl.split("/embed/")[1]}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <Play size={24} className="text-saphir-navy/20 group-hover:text-saphir-electric transition-colors" />
                          </div>
                        )}
                        {/* Bouton Play centré */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white text-saphir-navy rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-110 transition-all duration-300 opacity-90 group-hover:opacity-100">
                            <Play fill="currentColor" size={20} className="ml-1" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Titre et meta */}
                  <h4 className="font-bold text-lg leading-snug group-hover:text-saphir-electric transition-colors line-clamp-2 px-1">
                    {video.title}
                  </h4>
                  <p className="mt-3 text-[10px] text-saphir-navy/30 uppercase font-bold tracking-widest italic px-1">
                    {video.category || 'Replay'} • {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

