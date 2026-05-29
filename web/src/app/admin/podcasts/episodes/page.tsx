"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Plus, 
  ArrowLeft, 
  Play, 
  Mic, 
  Trash2, 
  Edit2,
  Clock,
  Calendar,
  Loader2
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

function EpisodesContent() {
  const { confirm, showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const seriesId = searchParams.get("series");
  
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seriesId) {
      router.push("/admin/podcasts");
      return;
    }
    fetchData();
  }, [seriesId]);

  async function fetchData() {
    setLoading(true);
    try {
      const [seriesRes, episodesRes] = await Promise.all([
        supabase.from("series").select("*").eq("id", seriesId).single(),
        supabase.from("podcasts").select("*").eq("series_id", seriesId).order("published_at", { ascending: false })
      ]);

      if (seriesRes.data) setSeries(seriesRes.data);
      if (episodesRes.data) setEpisodes(episodesRes.data);
    } catch (err) {
      console.error("Error fetching episodes data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEpisode(id: string) {
    const ok = await confirm({
      title: "Supprimer l'épisode",
      message: "Voulez-vous vraiment supprimer cet épisode ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      type: "danger"
    });
    
    if (!ok) return;
    
    try {
      const { error } = await supabase.from("podcasts").delete().eq("id", id);
      if (error) throw error;
      setEpisodes(episodes.filter(e => e.id !== id));
      showToast("Épisode supprimé avec succès", "success");
    } catch (err: any) {
      console.error("Error deleting episode:", err);
      showToast("Erreur lors de la suppression : " + err.message, "error");
    }
  }


  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-saphir-navy/20" size={40} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/podcasts" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-saphir-navy hover:text-saphir-electric transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-saphir-navy">{series?.title}</h1>
            <p className="text-xs font-bold text-saphir-navy/30 uppercase tracking-widest">Gestion des Épisodes</p>
          </div>
        </div>
        <Link 
          href={`/admin/podcasts/episodes/new?series=${seriesId}`}
          className="flex items-center gap-2 bg-saphir-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-saphir-electric transition-all shadow-lg"
        >
          <Plus size={20} />
          Nouvel Épisode
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest">Épisode</th>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-center">Durée</th>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-center">Date</th>
              <th className="px-8 py-5 text-[10px] font-bold text-saphir-navy/30 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {episodes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-saphir-navy/20 font-bold uppercase tracking-widest">Aucun épisode dans cette série</td>
              </tr>
            ) : (
              episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-saphir-navy/5 rounded-xl flex items-center justify-center text-saphir-electric">
                        <Play size={16} />
                      </div>
                      <div className="font-bold text-saphir-navy text-sm">{ep.title}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-xs font-bold text-saphir-navy/40">
                    {Math.floor((ep.duration || 0) / 60)} min
                  </td>
                  <td className="px-8 py-5 text-center text-xs font-bold text-saphir-navy/40">
                    {new Date(ep.published_at || ep.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/podcasts/episodes/edit/${ep.id}?series=${seriesId}`}
                        className="p-2 hover:bg-gray-100 rounded-lg text-saphir-navy/40 hover:text-saphir-navy transition-all"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => deleteEpisode(ep.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-saphir-navy/20 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminEpisodes() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-saphir-navy/20" size={40} /></div>}>
      <EpisodesContent />
    </Suspense>
  );
}
