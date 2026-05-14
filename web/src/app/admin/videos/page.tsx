"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Play, 
  Youtube, 
  ExternalLink,
  Edit2, 
  Trash2,
  Calendar,
  Loader2
} from "lucide-react";

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

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

  async function deleteVideo(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cette vidéo ?")) return;
    
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
      setVideos(videos.filter(v => v.id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Vidéos & Replays</h1>
          <p className="text-saphir-navy/40">Gérez vos contenus vidéo et lives studio.</p>
        </div>
        <Link 
          href="/admin/videos/new"
          className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10"
        >
          <Plus size={20} />
          Ajouter une Vidéo
        </Link>
      </div>

      {/* Video Table/List */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50 flex gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-saphir-navy/20" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher une vidéo..." 
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-saphir-navy focus:ring-2 focus:ring-saphir-electric/20 transition-all text-sm"
              />
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 p-8 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-4">
                 <div className="aspect-video bg-gray-100 rounded-3xl"></div>
                 <div className="h-5 bg-gray-100 w-full rounded"></div>
                 <div className="h-4 bg-gray-100 w-1/3 rounded"></div>
              </div>
            ))
          ) : videos.length === 0 ? (
            <div className="col-span-3 py-10 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
              Aucune vidéo trouvée
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="group flex flex-col space-y-4">
                 <div className="aspect-video bg-gray-50 rounded-3xl relative overflow-hidden border border-gray-100 flex items-center justify-center">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Play size={24} className="text-saphir-navy/10 group-hover:text-saphir-electric transition-colors" />
                    )}
                 </div>
                 <div>
                    <h4 className="font-bold text-saphir-navy text-sm leading-snug group-hover:text-saphir-electric transition-colors mb-2">{video.title}</h4>
                    <div className="flex items-center justify-between">
                       <span className="flex items-center gap-1 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest italic">
                          <Calendar size={12} /> {new Date(video.created_at).toLocaleDateString()}
                       </span>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/videos/edit/${video.id}`}
                            className="p-2 bg-gray-50 text-saphir-navy/40 hover:text-saphir-electric rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button 
                            onClick={() => deleteVideo(video.id)}
                            className="p-2 bg-gray-50 text-saphir-navy/40 hover:text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
