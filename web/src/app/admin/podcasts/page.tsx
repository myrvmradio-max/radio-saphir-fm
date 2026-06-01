"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Headphones,
  Loader2,
  Clock,
  Music
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminPodcasts() {
  const { confirm, showToast } = useToast();
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  async function fetchPodcasts() {
    try {
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setPodcasts(data || []);
    } catch (error: any) {
      console.error("Error fetching podcasts:", error);
      showToast("Erreur lors de la récupération des podcasts : " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function deletePodcast(id: string) {
    const ok = await confirm({
      title: "Supprimer le podcast",
      message: "Voulez-vous vraiment supprimer ce podcast ? Cette action est définitive et irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      type: "danger"
    });
    
    if (!ok) return;
    
    try {
      const { error } = await supabase.from("podcasts").delete().eq("id", id);
      if (error) throw error;
      setPodcasts(podcasts.filter(p => p.id !== id));
      showToast("Podcast supprimé avec succès", "success");
    } catch (error: any) {
      console.error("Error deleting podcast:", error);
      showToast("Erreur lors de la suppression : " + error.message, "error");
    }
  }

  // Calcul du temps total en minutes
  const totalDurationMin = Math.round(
    podcasts.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Gestion des Podcasts</h1>
          <p className="text-saphir-navy/40">Ajoutez et gérez les fichiers audio de vos podcasts en direct.</p>
        </div>
        <Link 
          href="/admin/podcasts/new"
          className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10"
        >
          <Plus size={16} />
          Nouveau Podcast
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-saphir-electric/10 rounded-2xl flex items-center justify-center text-saphir-electric">
              <Headphones size={24} />
           </div>
           <div>
              <div className="text-xl font-bold text-saphir-navy">
                {loading ? <Loader2 size={18} className="animate-spin text-saphir-navy/20" /> : podcasts.length}
              </div>
              <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Podcasts Actifs</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
              <Clock size={24} />
           </div>
           <div>
              <div className="text-xl font-bold text-saphir-navy">
                {loading ? <Loader2 size={18} className="animate-spin text-saphir-navy/20" /> : `${totalDurationMin} min`}
              </div>
              <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Durée Cumulée</div>
           </div>
        </div>
      </div>

      {/* Podcasts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 animate-pulse">
               <div className="aspect-video bg-gray-50 rounded-2xl mb-6"></div>
               <div className="h-6 bg-gray-50 w-2/3 mb-2 rounded"></div>
               <div className="h-4 bg-gray-50 w-1/3 rounded"></div>
            </div>
          ))
        ) : podcasts.length === 0 ? (
          <div className="col-span-3 py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest flex flex-col items-center justify-center gap-4">
            <Music size={40} className="text-saphir-navy/10 animate-bounce" />
            Aucun podcast trouvé
          </div>
        ) : (
          podcasts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden relative">
                  {p.cover_image ? (
                    <img src={p.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-saphir-navy/5 font-bold text-3xl italic">PODCAST</div>
                  )}
                  {p.duration > 0 && (
                    <span className="absolute bottom-3 right-3 bg-saphir-navy/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <Clock size={10} />
                      {Math.floor(p.duration / 60)} min
                    </span>
                  )}
                </div>
                <div className="p-8 pb-4">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-saphir-navy line-clamp-1">{p.title}</h3>
                      <button 
                        onClick={() => deletePodcast(p.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 transition-all flex-shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                   <p className="text-xs text-saphir-navy/60 line-clamp-3 leading-relaxed font-medium mb-4">{p.description || 'Aucune description'}</p>
                </div>
              </div>
              <div className="p-8 pt-0">
                <Link href={`/admin/podcasts/edit/${p.id}`} className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl font-bold text-xs text-saphir-navy hover:bg-saphir-navy hover:text-white transition-all shadow-inner">
                  <Edit2 size={14} /> Gérer & Modifier
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
