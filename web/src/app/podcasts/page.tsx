"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Headphones, Play, Pause, Download, Clock, Loader2, Music, Search } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export default function PodcastsPage() {
  const { isPlaying: isLivePlaying, togglePlay: toggleLivePlay } = useAudio();
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // États pour l'écoute directe
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const { data, error } = await supabase
          .from("podcasts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPodcasts(data || []);
        setFilteredPodcasts(data || []);
      } catch (error) {
        console.error("Error fetching podcasts data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPodcasts();

    // Clean up audio element on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Recherche temps réel
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPodcasts(podcasts);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredPodcasts(
        podcasts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, podcasts]);

  // Gérer la lecture / pause d'un podcast
  const handlePlayPodcast = async (podcast: any) => {
    // 1. Mettre sur pause le direct si actif
    if (isLivePlaying) {
      await toggleLivePlay();
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Événements audio
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });

      audioRef.current.addEventListener("loadedmetadata", () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener("ended", () => {
        setPlayingId(null);
        setIsPlayingPodcast(false);
        setCurrentTime(0);
      });
    }

    const audio = audioRef.current;

    if (playingId === podcast.id) {
      if (isPlayingPodcast) {
        audio.pause();
        setIsPlayingPodcast(false);
      } else {
        try {
          await audio.play();
          setIsPlayingPodcast(true);
        } catch (err) {
          console.error("Play error:", err);
        }
      }
    } else {
      audio.pause();
      audio.src = podcast.audio_url;
      audio.load();
      setPlayingId(podcast.id);
      setCurrentTime(0);
      setDuration(podcast.duration || 0);
      try {
        await audio.play();
        setIsPlayingPodcast(true);
      } catch (err) {
        console.error("Play error:", err);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Header Hero */}
        <div className="pt-32 pb-16 bg-gradient-to-b from-gray-50/80 to-white/40 border-b border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-saphir-electric/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex items-center gap-2 text-saphir-electric font-black text-xs tracking-widest uppercase mb-4">
              <Headphones size={14} />
              <span>Médiathèque</span>
            </div>
            <h1 className="font-playfair text-5xl md:text-6xl font-black text-saphir-navy mb-6 tracking-tight">Les Podcasts Saphir</h1>
            <p className="text-saphir-navy/40 max-w-2xl text-md leading-relaxed font-medium mb-10">
              Écoutez nos émissions et enregistrements exclusifs directement depuis notre lecteur intégré ou téléchargez-les pour une écoute hors ligne.
            </p>

            {/* Barre de recherche */}
            <div className="max-w-md bg-white border border-gray-100 rounded-2xl flex items-center px-4 py-3 shadow-md shadow-saphir-navy/5 hover:border-saphir-electric/30 transition-all">
              <Search className="text-saphir-navy/30 mr-3 flex-shrink-0" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un podcast..." 
                className="w-full border-none focus:ring-0 placeholder:text-gray-300 font-bold text-xs text-saphir-navy"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Liste des podcasts */}
        <section className="py-16 container mx-auto px-6 max-w-5xl">
          <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
            <h2 className="text-xl font-bold text-saphir-navy flex items-center gap-3">
              <Music className="text-saphir-electric animate-pulse" size={20} /> Tous nos podcasts
            </h2>
            <span className="bg-gray-50 text-[10px] font-black text-saphir-navy/40 uppercase tracking-widest px-3 py-1.5 rounded-full">
              {filteredPodcasts.length} Disponible(s)
            </span>
          </div>
          
          <div className="space-y-6">
            {loading ? (
               [1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white rounded-3xl border border-gray-50 animate-pulse flex items-center p-6 gap-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-50 w-1/3 rounded"></div>
                    <div className="h-3 bg-gray-50 w-2/3 rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredPodcasts.length === 0 ? (
              <div className="py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest flex flex-col items-center justify-center gap-4">
                <Music size={48} className="text-saphir-navy/5" />
                Aucun podcast trouvé
              </div>
            ) : (
              filteredPodcasts.map((podcast) => {
                const isCurrent = playingId === podcast.id;
                return (
                  <div 
                    key={podcast.id} 
                    className={`p-6 bg-white rounded-[2rem] border transition-all duration-300 flex flex-col gap-6 shadow-sm hover:shadow-md relative overflow-hidden ${
                      isCurrent 
                        ? "border-saphir-electric/30 shadow-lg shadow-saphir-electric/[0.02]" 
                        : "border-gray-50"
                    }`}
                  >
                    {/* Background visualizer pulse when playing */}
                    {isCurrent && isPlayingPodcast && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-saphir-electric/5 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                      {/* Image de couverture */}
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center relative group">
                        {podcast.cover_image ? (
                          <img src={podcast.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <Music className="text-saphir-navy/15" size={24} />
                        )}
                        
                        {/* Play Overlay on cover for hover */}
                        <button 
                          onClick={() => handlePlayPodcast(podcast)}
                          className="absolute inset-0 bg-saphir-navy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {isCurrent && isPlayingPodcast ? (
                            <Pause size={18} fill="white" className="text-white" />
                          ) : (
                            <Play size={18} fill="white" className="text-white ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1.5">
                          <span className="bg-saphir-navy/5 text-saphir-navy/45 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                            Podcast
                          </span>
                          <span className="text-[10px] text-saphir-navy/35 font-bold uppercase flex items-center gap-1.5">
                            <Clock size={11} />
                            {podcast.duration ? `${Math.floor(podcast.duration / 60)} min` : "Non spécifié"}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-saphir-navy truncate mb-2 group-hover:text-saphir-electric transition-colors leading-tight">
                          {podcast.title}
                        </h4>
                        <p className="text-xs text-saphir-navy/50 leading-relaxed font-medium line-clamp-2">
                          {podcast.description || "Aucune description fournie pour ce podcast."}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-gray-50 md:border-t-0 pt-4 md:pt-0">
                        {/* Play button */}
                        <button 
                          onClick={() => handlePlayPodcast(podcast)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 flex-shrink-0 ${
                            isCurrent && isPlayingPodcast 
                              ? "bg-saphir-electric text-white shadow-saphir-electric/25" 
                              : "bg-saphir-navy text-white shadow-saphir-navy/15 hover:bg-saphir-electric hover:shadow-saphir-electric/25"
                          }`}
                        >
                          {isCurrent && isPlayingPodcast ? (
                            <Pause size={20} fill="white" />
                          ) : (
                            <Play size={20} fill="white" className="ml-0.5" />
                          )}
                        </button>

                        {/* Download button */}
                        <a 
                          href={podcast.audio_url} 
                          download={`${podcast.title}.mp3`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-saphir-navy/40 hover:bg-saphir-navy hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm flex-shrink-0"
                          title="Télécharger l'audio"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    </div>

                    {/* Inline Seekbar Player (Only when selected) */}
                    {isCurrent && (
                      <div className="mt-2 bg-gray-50/50 border border-gray-50 rounded-2xl p-4 animate-fade-in flex flex-col sm:flex-row items-center gap-4 relative z-10 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-saphir-navy/50 w-10 text-center font-mono">
                          {formatTime(currentTime)}
                        </span>
                        
                        <input 
                          type="range" 
                          min="0" 
                          max={duration || 100}
                          value={currentTime} 
                          onChange={handleSeek}
                          className="flex-1 w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-saphir-electric focus:outline-none"
                        />
                        
                        <span className="text-[10px] font-bold text-saphir-navy/50 w-10 text-center font-mono">
                          {formatTime(duration)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
