"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Play, 
  Mic, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Headphones,
  Loader2
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminPodcasts() {
  const { confirm, showToast } = useToast();
  const [series, setSeries] = useState<any[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeries();
  }, []);

  async function fetchSeries() {
    try {
      const [seriesRes, episodesCountRes] = await Promise.all([
        supabase
          .from("series")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("podcasts")
          .select("*", { count: "exact", head: true })
      ]);
      
      if (seriesRes.error) throw seriesRes.error;
      if (episodesCountRes.error) throw episodesCountRes.error;

      setSeries(seriesRes.data || []);
      setTotalEpisodes(episodesCountRes.count || 0);
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSeries(id: string) {
    const ok = await confirm({
      title: "Supprimer la série",
      message: "Voulez-vous vraiment supprimer cette série de podcasts ? Tous les épisodes liés seront conservés mais détachés. Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      type: "danger"
    });
    
    if (!ok) return;
    
    try {
      const { error } = await supabase.from("series").delete().eq("id", id);
      if (error) throw error;
      setSeries(series.filter(s => s.id !== id));
      showToast("Série supprimée avec succès", "success");
    } catch (error) {
      console.error("Error deleting series:", error);
      showToast("Erreur lors de la suppression", "error");
    }
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-saphir-navy mb-2">Gestion des Podcasts</h1>
          <p className="text-saphir-navy/40">Gérez vos séries, émissions et épisodes.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/podcasts/episodes/new"
            className="flex items-center gap-2 bg-white border border-gray-100 text-saphir-navy px-6 py-3 rounded-2xl font-bold text-xs hover:bg-gray-50 transition-all shadow-sm"
          >
            <Plus size={16} className="text-saphir-electric" />
            Nouvel Épisode
          </Link>
          <Link 
            href="/admin/podcasts/new"
            className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-saphir-electric transition-all shadow-lg shadow-saphir-navy/10"
          >
            <Plus size={16} />
            Nouvelle Série
          </Link>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-saphir-electric/10 rounded-2xl flex items-center justify-center text-saphir-electric">
              <Headphones size={24} />
           </div>
           <div>
              <div className="text-xl font-bold text-saphir-navy">
                {loading ? <Loader2 size={18} className="animate-spin text-saphir-navy/20" /> : series.length}
              </div>
              <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Séries Actives</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
              <Mic size={24} />
           </div>
           <div>
              <div className="text-xl font-bold text-saphir-navy">
                {loading ? <Loader2 size={18} className="animate-spin text-saphir-navy/20" /> : totalEpisodes}
              </div>
              <div className="text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Épisodes Total</div>
           </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 animate-pulse">
               <div className="aspect-video bg-gray-50 rounded-2xl mb-6"></div>
               <div className="h-6 bg-gray-50 w-2/3 mb-2 rounded"></div>
               <div className="h-4 bg-gray-50 w-1/3 rounded"></div>
            </div>
          ))
        ) : series.length === 0 ? (
          <div className="col-span-3 py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">
            Aucune série trouvée
          </div>
        ) : (
          series.map((s) => (
            <div key={s.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                {s.cover_image ? (
                  <img src={s.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-saphir-navy/5 font-bold text-3xl italic">PODCAST</div>
                )}
              </div>
              <div className="p-8">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-saphir-navy line-clamp-1">{s.title}</h3>
                      <p className="text-[10px] text-saphir-navy/40 uppercase font-bold tracking-widest">Série</p>
                    </div>
                    <button 
                      onClick={() => deleteSeries(s.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
                 <p className="text-xs text-saphir-navy/60 mb-8 line-clamp-2">{s.description || 'Aucune description'}</p>
                 <div className="flex gap-2">
                    <Link href={`/admin/podcasts/episodes?series=${s.id}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl font-bold text-xs text-saphir-navy hover:bg-saphir-navy hover:text-white transition-all">
                      <Edit2 size={14} /> Gérer
                    </Link>
                    <Link 
                      href={`/admin/podcasts/episodes/new?series=${s.id}`} 
                      className="w-12 h-12 flex items-center justify-center bg-saphir-electric/10 text-saphir-electric rounded-xl hover:bg-saphir-electric hover:text-white transition-all"
                      title="Ajouter un épisode"
                    >
                      <Plus size={20} />
                    </Link>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
